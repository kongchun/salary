var express = require('express');
var router = express.Router();
var swig = require('swig');
var read = require('../server/read.js');
var update = require('../server/update.js');

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
                    salary.compare = '同比下降3%';
                    res.send({salary:salary,arr:arr});
                })
            }else{
                res.send({salary:salary,arr:arr});
            }
        }else{
            res.send({});
        }
    }).catch(e=>{
        console.log(e);
        res.send({});
    });
});

router.post('/readAverageSalary',function(req,res){
    var year = req.body.year;
    var month = req.body.month;
    update.updateAveraheSalaryCount({year:year,month:month}).then(function(data){
        res.send(data);
    }).catch(e=>{
        console.log(e);
        res.send({});
    });
});

module.exports = router;