var express = require('express');
var router = express.Router();
var swig = require('swig');
var read = require('../server/read.js');
var update = require('../server/update.js');
var service = require('../server/service.js');

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
    var bdStatus = req.query.positionConfirm;
    
    if(!!page) page = parseInt(page);
    if(!!limit) limit = parseInt(limit);
    read.getCompanyList(page,limit,bdStatus).then(function(data){
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

router.get('/getcompanyById', function(req, res) {
    var _id = req.query._id;
    read.getCompanyById(_id).then(function(data){
        if(!!data){
            res.send(data);
        }else{
            res.send({});
        }
    }).catch(e=>{
        console.log(e);
        res.send({});
    });
});

router.post('/updateCompanyPosition', function(req, res) {
	var _id = req.body._id;
    var lat = req.body.lat;
    var lng = req.body.lng;
    var city = req.body.city;
    var district = req.body.district;
    update.updateCompanyPosition({_id:_id,position:{lat:lat,lng:lng},city:city,district:district}).then(function(data) {
		res.send(data);
	}).catch(function(e) {
        console.error(e);
        res.send({});
	})
});

router.post('/deleteCompanyById', function(req, res) {
	var _id = req.body._id;
    update.deleteCompany({_id:_id}).then(function(data) {
		res.send(data);
	}).catch(function(e) {
        console.error(e);
        res.send({});
	})
});

router.get('/onelevel', function(req, res) {
    res.send([]);
});

router.get('/charts', function(req, res, next) {
    var page ;
    page = swig.renderFile('dist/manage/charts.html', {
        html: ""
    });
    res.send(page);
});

router.get('/tables', function(req, res, next) {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth()+1;
    read.getTableRank(year,month).then(ret=>{
        ret.types = ['基础','框架和库','MVVM','图形','构建服务','数据库'];
        res.render('tables', ret);
    }).catch(e=>{
        res.render('tables', {"errorMsg":e});
    });
    // service.getTopRank().then(toprank=>{
    //     let types = ['基础','框架和库','MVVM','图形','构建服务','数据库'];
    //     service.getTechDetailRanks(types).then(detailRank=>{
    //         read.getAvgSarlyRank(10).then(companyRank=>{
    //             read.getCountJobRank(10).then(jobRank=>{
    //                 res.render('tables', {toprank,types,detailRank,companyRank,jobRank});
    //             });
    //         });
    //     });
    // }).catch(e=>{
    //     res.render('tables', {"errorMsg":e});
    // });
});

router.get('/controlpage', function(req, res, next) {
    var page ;
    page = swig.renderFile('dist/manage/controlpage.html', {
        html: ""
    });
    res.send(page);
});

module.exports = router;
