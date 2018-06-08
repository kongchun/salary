var express = require('express');
var router = express.Router();
var swig = require('swig');
var read = require('../server/read.js');

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

module.exports = router;