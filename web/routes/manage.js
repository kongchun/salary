var express = require('express');
var router = express.Router();
var swig = require('swig');
var read = require('../server/read.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    var page ;
    page = swig.renderFile('dist/manage/home.html', {
        html: ""
    });
    res.send(page);
});

router.get('/pagecompany', function(req, res, next) {
    var page ;
    page = swig.renderFile('dist/manage/company.html', {
        html: ""
    });
    res.send(page);
});

router.get('/pagecompanyposition', function(req, res, next) {
    var page ;
    page = swig.renderFile('dist/manage/companyposition.html', {
        html: ""
    });
    res.send(page);
});

router.get('/listcompany', function(req, res) {
    var page = req.query.page;
    var limit = req.query.limit;
    if(!!page) page = parseInt(page);
    if(!!limit) limit = parseInt(limit);
    read.getCompanyList(page,limit).then(function(data){
        if(!!data){
            res.send({code:0,count:data.count,data:data.data,msg:''});
        }else{
            res.send({code:0,count:0,data:[],msg:''});
        }
    }).catch(e=>{
        console.log(e);
        res.send({code:0,count:0,data:[],msg:''});
    });
});

router.get('/onelevel', function(req, res) {
    res.send([]);
});

module.exports = router;
