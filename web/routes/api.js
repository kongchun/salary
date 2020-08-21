var express = require('express');
var router = express.Router();
var swig = require('swig');
var read = require('../server/read.js');
var update = require('../server/update.js');
var service = require('../server/service.js');

router.get('/getAverageSalary',function(req,res){
	let year =  req.query.year;
    let month =  req.query.month;
    if(!!year && !!month){
        read.getAverageSalaryByDate(year,month).then(function(data){
            if(!!data && !!data.points){
                res.send(data);
            }else{
                res.send({year,month});
            }
        }).catch(e=>{
            console.log(e);
            res.send({year,month});
        });
    }else{
        read.getAverageSalaryInfo().then(function(data){
            if(!!data && !!data.points){
                res.send(data);
            }else{
                res.send({});
            }
        }).catch(e=>{
            console.log(e);
            res.send({});
        });
    }
	
});

router.get('/getChartsSalaryInfo',function(req,res){
    let year =  req.query.year;
    let month =  req.query.month;
    if(!!year && !!month){
        read.getChartsSalaryInfoByDate(year,month).then(function(data){
            res.send(data);  
        }).catch(e=>{
            console.log(e);
            res.send({});
        });
    }else{
        read.getChartsSalaryInfoByNews().then(function(data){
            res.send(data);
        }).catch(e=>{
            console.log(e);
            res.send({});
        });
    }
    
});

router.get('/getNewAverageSalary',function(req,res){
    read.getAverageSalary().then(function(data){
        if(!!data && data.length>0){
            var salary = data[0]||{};
            var arr = [];
            data.forEach(function(d){
                if(!!d.month && d.year)
                    arr.push({ "key": d.month, "type": "薪资", "value": d.average});
            });
            if(!!data[0].year && !!data[0].month){
                read.getHitsByTime(salary.year,salary.month).then(hits=>{
                    if(!!hits && !!hits.read){
                        salary.read = hits.read;
                    }else{
                        salary.read = 0;
                    }
                    makeCompareStr(arr,salary);
                    res.send({salary:salary,arr:arr.reverse()});
                })
            }else{
                res.send({salary:salary,arr:arr.reverse()});
            }
        }else{
            res.send({});
        }
    }).catch(e=>{
        console.log(e);
        res.send({});
    });
});

function makeCompareStr(arr,salary){
    if(arr.length>1){
        let nowAvg = arr[0].value;
        let lastAvg = arr[1].value;
        let compareStr = '同比上升';
        let mid = -100;
        salary.per = 'up';
        if(nowAvg<lastAvg){
            compareStr = '同比下降';
            mid = 100;
            salary.per = 'down';
        }
        salary.compare =  compareStr + ((1-(nowAvg/lastAvg))*mid).toFixed(1) +'%';
    }else{
        salary.compare = '';
    }
}

router.post('/readAverageSalary',function(req,res){
    var year = req.body.year;
    var month = req.body.month;
    if(!!year && !!month){
        update.updateAveraheSalaryCount({year:year,month:month}).then(function(data){
        res.send(data);
        }).catch(e=>{
            console.log(e);
            res.send({});
        });
    }else{
        res.send({});
    }
    
});

router.get('/dataStatistics', function(req, res, next) {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth()+1;
    read.getAverageSalaryInfo().then(board=>{
        year = board.year;
        month = board.month;
        read.getTableRank(year,month).then(ret=>{
            res.send(ret);
        }).catch(e=>{
            console.log(e);
            res.send({});
        });
    }).catch(e=>{
        console.log(e);
        res.send({});
    });
    
    
});

router.get('/getSurroundingSalary', function(req, res, next) {
    let latitude =  req.query.latitude;
    let longitude =  req.query.longitude;
    let distance = req.query.distance;
    service.getSurroundingSalary(latitude,longitude,distance).then(ret=>{
        res.send(ret);
    }).catch(e=>{
        console.log(e);
        res.send({});
    });
    
});

router.get('/getTopTech', async (req, res, next) => {
    try {
        let num = parseInt(req.query.num);
        if (isNaN(num)) {
            num = 100;
        }
        
       
        let data = await service.getTopRankByLatestMonth(num);
        res.send(data);
    } catch (e) {
        console.error(e);
        res.send([]);
    }
});

router.get('/getTagCloud', async (req, res) => {
    let year = req.query.year;
    let month = req.query.month;
    if (!year || !month) {
        let now = new Date();
        year = now.getFullYear();
        month = now.getMonth() + 1;
    }
    try {

        let result = await read.getTagCloudImg(year + '', month + '');
        res.send(result.data);
    } catch (e) {
        console.error(e);
        res.send([]);
    }
});

router.post('/getCompanyLogoAndScore', async (req, res) => {
    let param = req.body.data;
    let companies = param.split(',');
    try {
        let result = await read.getCompanyLogoAndScore(companies);
        res.send(result);
    } catch (e) {
        console.error(e);
        res.send([]);
    }
});

router.post('/getCompanyById', async (req, res) => {
    let _id = req.body._id;
    try {
        let result = await read.getCompanyById(_id);
        res.send(result);
    } catch (e) {
        console.error(e);
        res.send({});
    }
});

router.get('/getAverageSalaryByCompany', async (req, res) => {
    let companyName = req.query.name;
    try {
        let averages = await read.getAverageSalaryByCompany(companyName);
        let array = averages.reverse();
        let result = [];
        for (let data of array) {
            result.push({
                key: data.year + '' + data.month,
                type: '薪酬',
                value: data.average
            });
        }
        res.send(result);
    } catch (e) {
        console.error(e);
        res.send([]);
    }
});

module.exports = router;