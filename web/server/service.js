var read = require('./read.js');

//技能 top20 总排行
exports.getTopRank = function(limit=20){
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth()+1;
    return new Promise((resolve, reject) => {
        read.getTopRank(year,month,limit).then(topRank=>{
            if(!!topRank && topRank.length>0){
                resolve(topRank);
            }else{
                if(month ==1){
                    year--;
                    month = 12;
                }else{
                    month--;
                }
                read.getTopRank(year,month,limit).then(topRank2=>{
                    if(!!!topRank2 || topRank2.length<=0){
                        topRank2 = [];
                    }
                    resolve(topRank2);
                }).catch(e=>{
                    reject(e);
                });
            }
        }).catch(e=>{
            reject(e);
        });
    });
};

exports.getTechDetailRanks = function(types){
    return new Promise((resolve, reject) => {
        let ranks = [];
        if(!!types && types.length>0){
            this.getTechDetailRank(0,types,ranks).then(res=>{
                resolve(res);
            })
        }else{
            resolve(ranks);
        }
    });
};

exports.getTechDetailRank = function(index,types,ranks){
    return new Promise((resolve, reject) => {
        if(!!types && types.length<=index){
            resolve(ranks);
            return;
        }
        let type = types[index++];
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth()+1;
        read.getTopRank(year,month,10,type).then(topRank=>{
            if(!!topRank && topRank.length>0){
                ranks.push(topRank);
                this.getTechDetailRank(index,types,ranks).then(res=>{
                    resolve(res);
                });
            }else{
                let year2 = year;
                let month2 = month;
                if(month2 ==1){
                    year2--;
                    month2 = 12;
                }else{
                    month2--;
                }
                read.getTopRank(year2,month2,10,type).then(topRank2=>{
                    if(!!!topRank2 || topRank2.length<=0){
                        topRank2 = [];
                    }
                    ranks.push(topRank2);
                    this.getTechDetailRank(index,types,ranks).then(res=>{
                        resolve(res);
                    });
                }).catch(e=>{
                    reject(e);
                });
            }
        }).catch(e=>{
            reject(e);
        });
    });
}