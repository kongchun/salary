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
        read.getAverageSalary().then(function(data){
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
        if(!!data && !!data.points){
            if(!!data.year && !!data.month){
                read.getHitsByTime(data.year,data.month).then(hits=>{
                    if(!!hits && !!hits.read){
                        data.read = hits.read;
                    }else{
                        data.read = 0;
                    }
                    data.compare = '同比下降3%';
                    res.send(data);
                })
            }else{
                res.send(data);
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