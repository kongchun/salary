import helper from "../../iRobots/helper.js";
import Container from "./Container.js";
import Company from "./model/Company.js";

export default class ViewData {
    constructor(db, table,year,month,types=['基础','框架和库','MVVM','图形','构建服务','数据库']) {
        this.db = db;
        this.year = year;
        this.month = month;
        this.table = table;
        this.types = types;
    }
    async show(){
        await this.average();
        await this.chart();
        await this.tech();
        await this.top();
    }
    async top(){
        try {
            var toprank = await this.getTopRank(50);
            var detailRank = await this.getTechDetailRanks(this.types);
            var companyRank = await this.getAvgSarlyRank(50);
            var jobRank = await this.getCountJobRank(50);

            var year = this.year;
            var month = this.month;
            var types = this.types;
            var time = new Date();

            this.setTop({toprank,detailRank,companyRank,jobRank,types,year,month,time});
        }catch(e){
            console.error(error);
            throw error;
        }

    }

    async setTop(top){
        this.db.close();
        await this.db.open(this.table.top)
        var data = await this.db.collection.findOne({
            year: this.year,
            month:this.month
        })
        
        //console.log(JSON.stringify(top,null,4))
        if (data) {
            await this.db.collection.update({
                year: this.year,
                month:this.month
            }, {
                $set: top
            })
        } else {
            await this.db.collection.insert(top);
        }
       

        this.db.close();
        console.log("top success");
    
    }

    async getTopRank(limit=20){
        return await this.getTopRankDb(this.year,this.month,limit);
    }
    async getTechDetailRanks(types){
       var arr = [];
       for(var type in types){
         var k = await this.getTopRankDb(this.year,this.month,10,types[type]);
         arr.push(k);
        }
        console.log(arr.length);
        return arr;
    };
  
    getTopRankDb(year,month,limit,type) {
        this.db.close();
        var query = {year:year+'',month:month+''};
        if(!!type){
            query.type = type;
        }
        return this.db.open(this.table.tech).then((collection) =>{
            return collection.find(query,{tech:1,type:1,count:1}).sort({count:-1}).skip(0).limit(limit).toArray();
        }).then((data)=> {
            this.db.close();
            return data;
        }).catch((error) => {
            this.db.close();
            console.error(error)
            throw error;
        })
    };
    getAvgSarlyRank(limit) {
        this.db.close();
        var query = {};
        return this.db.open(this.table.job).then((collection) =>{
            return collection.find(query,{company:1,average:1}).sort({average:-1}).skip(0).limit(limit).toArray();
        }).then((data)=> {
            this.db.close();
            let hash = {};
            data = data.reduce((item, next) => {
                hash[next.company] ? '' : hash[next.company] = true && item.push(next);
                return item
            }, []);

            return data;
        }).catch((error)=> {
            this.db.close();
            console.error(error)
            throw error;
        })
    };
    getCountJobRank(limit) {
        this.db.close();
        var query = {};
        return this.db.open(this.table.company).then((collection)=> {
            return collection.find(query,{company:1,count:1}).sort({count:-1}).skip(0).limit(limit).toArray();
        }).then((data)=> {
            this.db.close();
            return data;
        }).catch((error)=> {
            this.db.close();
            console.error(error)
            throw error;
        })
    };

    async average() {
        try {
            this.db.close();
            await this.db.open(this.table.job);
            var data = await this.db.findToArray({}, { average: 1 });
            this.db.close();

            var count =0;
            var total = 0;

            data.forEach((i) => {
                if(i.average>0){
                    total += i.average
                    count++
                }
            });
            console.log(total, count)
            var average = total / count;
            average = (average.toFixed(2));
             console.log(average)

            await this.db.open(this.table.board);
            var data = await this.db.collection.findOne({
                year: this.year,
                month:this.month
            })

             if (data) {
                await this.db.collection.update({
                    year: this.year,
                    month:this.month
                }, {
                    $set: {
                        average: parseFloat(average),
                        time:new Date(this.year,this.month-1),
                        publish:false
                    }
                })
            } else {
                await this.db.collection.insert({
                    year: this.year,
                    month:this.month,
                    average: parseFloat(average),
                    time:new Date(this.year,this.month-1),
                    publish:false
                })
            }
                
            this.db.close();
            console.log("average success");
        }catch(e){
            this.db.close()
            console.log(e);
            return;
        }
    }


    async chart() {
        try {
            this.db.close();
            await this.db.open(this.table.job);
            var data = await this.db.collection.group({
                'salaryRange': true
            }, {
                filter: {
                    $ne: true
                },
                position: {
                    $ne: null
                }
            }, {
                positions: [],
                "count": 0
            }, (doc, prev) => {
                prev.count++;
                var {
                    lat,
                    lng
                } = doc.position;
                prev.positions.push([lng, lat, 1])
            }, true)


            var points = {};
            var salaryRange = [];
            data.forEach((i) => {
                points[i.salaryRange] = i.positions
                salaryRange.push({
                    "label": i.salaryRange,
                    "count": i.count
                })
            });
            console.log(points)
            console.log(salaryRange)


            //eduRange;
            var data = await this.db.collection.group({
                'eduRange': true
            }, {
                filter: {
                    $ne: true
                }
            }, {

                "count": 0
            }, function(doc, prev) {
                prev.count++;
            }, true);

            var eduRange = []
            data.forEach((i) => {
                eduRange.push({
                    "label": i.eduRange,
                    "count": i.count
                })
            })
            console.log(eduRange);

            //yearRange
            var data = await this.db.collection.group({
                'yearRange': true
            }, {
                filter: {
                    $ne: true
                }
            }, {

                "count": 0
            }, function(doc, prev) {
                prev.count++;
            }, true)


            var yearRange = []
            data.forEach((i) => {
                yearRange.push({
                    "label": i.yearRange,
                    "count": i.count
                })
            })
            console.log(yearRange);

            //districtRange
            var data = await this.db.collection.group({
                'district': true
            }, {
                filter: {
                    $ne: true
                }
            }, {

                "count": 0
            }, function(doc, prev) {
                prev.count++;
            }, true)


            var districtRange = []
            data.forEach((i) => {
                districtRange.push({
                    "label": i.district,
                    "count": i.count
                })
            })

            //console.log(districtRange);

            this.db.close();
            await this.db.open(this.table.board);
            var data = await this.db.collection.findOne({
                year: this.year,
                month: this.month
            })


            if (data) {
                await this.db.collection.update({
                    year: this.year,
                    month: this.month
                }, {
                    $set: {
                        year: this.year,
                        month: this.month,
                        points: points,
                        salaryRange: salaryRange,
                        eduRange: eduRange,
                        yearRange: yearRange,
                        districtRange: districtRange,
                        time: new Date(this.year, this.month - 1),
                        publish: false
                    }
                })
            } else {
                await this.db.collection.insert({
                    year: this.year,
                    month: this.month,
                    points: points,
                    salaryRange: salaryRange,
                    eduRange: eduRange,
                    yearRange: yearRange,
                    districtRange: districtRange,
                    time: new Date(this.year, this.month - 1),
                    publish: false
                })
            }

            this.db.close();
            console.log("chart success");
        } catch (e) {
            this.db.close()
            console.log(e);
            return;
        }


 
    }

    topTen(){
         this.db.close();
        
    }

    async tech() {
        try{
            let techCount ={};
            await this.db.open(this.table.job);
            var arr =  await this.db.collection.find({
                info: {
                    $ne: null
                }
            }, {
                info: 1
            }).toArray();
      
            this.db.close();

            arr.forEach((data)=>{
            var content = (data.info).toLowerCase();
                for (let prop in TECH) {
                    if (!techCount[prop]) {
                        techCount[prop] = 0;
                    }

                    var text = prop.toLowerCase();
                    if (content.indexOf(text) > -1) {
                        techCount[prop]++;
                    }
                }
            })


             techCount["javascript"] = techCount["javascript"] + techCount["js"] - techCount["json"];
                techCount["ES6+"] = techCount["ECMAScript"] 
                + techCount["ES6"] + techCount["ES7"]+techCount["ES8"]
                + techCount["ES2015"] + techCount["ES2016"]+techCount["ES2017"]+techCount["ES2018"];


                techCount["html"] = techCount["html"] + techCount["H5"];
                techCount["jquery"] = techCount["jq"];
                techCount["angular"] = techCount["ng"] - techCount["mongodb"]
                delete techCount['jq'];
                delete techCount['ng'];
                delete techCount['js'];
                delete techCount['H5'];

                delete techCount["ECMAScript"];
                delete techCount["ES6"];
                delete techCount["ES7"];
                delete techCount["ES8"];
                delete techCount["ES9"];

                delete techCount["ES2015"];
                delete techCount["ES2016"];
                delete techCount["ES2017"];
                delete techCount["ES2018"];

                var arr = [];
                for (let prop in techCount) {
                    arr.push({
                        year:this.year,
                        month:this.month,
                        tech: prop,
                        type: TECH[prop],
                        count: techCount[prop]
                    });
                };
             
                await this.db.open(this.table.tech);
                await this.db.collection.remove({});
                await this.db.collection.insertMany(arr);
                //console.log(arr);
                this.db.close();
               
        } catch (e) {
            this.db.close()
            console.log(e);
               
        }
    }
}



const TECH = {
    javascript: "基础",
    html: "基础",
    H5:"基础",
    css: "基础",
    ajax: "基础",
    json: "基础",
    webrtc: "基础",
    websocket: "基础",
    js: "基础",

    WebGL: "图形",
    Flash: "图形",
    canvas: "图形",
    svg: "图形",
    d3: "图形",
    echart: "图形",
    Three: "图形",
    ArcGIS: "图形",
    ChartJS: "图形",
    Highcharts: "图形",
    Flot: "图形",
    AntV:"图形",
    F2:"图形",
    G2:"图形",


    jq: "框架和库",
    jquery: "框架和库",
    zepto: "框架和库",
    prototype: "框架和库",
    handlebars:"框架和库",
    undersorce:"框架和库",
    lodash:"框架和库",

    bootstrap: "框架和库",
    MooTools: "框架和库",
    Dojo: "框架和库",
    YUI: "框架和库",
    Ext: "框架和库",
    Sencha: "框架和库",
    easyui: "框架和库",

    GWT: "MVVM",

    backbone: "MVVM",
    Knockout: "MVVM",
    riotjs:"MVVM",

    PhoneGap: "移动库",
    IONIC: "移动库",

    require: "基础",
    sea: "基础",
    common: "基础",

    react: "MVVM",
    vue: "MVVM",
    ng: "MVVM",
    angular: "MVVM",
    Redux: "MVVM",
    canJS:"MVVM",
    Ractive:"MVVM",

    node: "构建服务",
    npm: "构建服务",
    Express: "构建服务",
    koa: "构建服务",
    Hapi: "构建服务",

    ECMAScript: "基础",
    "ES6+": "基础",
    ES6: "基础",
    ES7: "基础",
    ES8: "基础",
    ES9: "基础",

    ES2015: "基础",
    ES2016: "基础",
    ES2017: "基础",
    ES2018: "基础",

    CoffeeScript: "基础",
    TypeScript: "基础",

    Grunt: "构建服务",
    gulp: "构建服务",
    Bower: "构建服务",
    less: "构建服务",
    sass: "构建服务",
    webpack: "构建服务",
    Yeoman: "构建服务",
    fis: "构建服务",

    mysql: "数据库",
    mongodb: "数据库",
    Oracle: "数据库",
    Redis: "数据库",
    Memcache: "数据库",
    postgresql: "数据库",
    NOSQL: "数据库",

    karma:"测试",
    jasmine:"测试",
    protractor:"测试",
    mock:"测试"
}
