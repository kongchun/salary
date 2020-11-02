var express = require('express');
var router = express.Router();
var swig = require('swig');
var read = require('../server/read.js');
var update = require('../server/update.js');
var service = require('../server/service.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    var page;
    page = swig.renderFile('dist/manage/home.html', {
        html: ""
    });
    res.send(page);
});

router.get('/pagecompany', function (req, res, next) {
    var page;
    page = swig.renderFile('dist/manage/company.html', {
        html: ""
    });
    res.send(page);
});

router.get('/pagecompanyposition', function (req, res, next) {
    var page;
    page = swig.renderFile('dist/manage/companyposition.html', {
        html: ""
    });
    res.send(page);
});

router.get('/listcompany', function (req, res) {
    var page = req.query.page;
    var limit = req.query.limit;
    var bdStatus = req.query.positionConfirm;
    let company = req.query.company;

    if (!!page) page = parseInt(page);
    if (!!limit) limit = parseInt(limit);
    read.getCompanyList(page, limit, bdStatus, company).then(function (data) {
        if (!!data) {
            res.send({ code: 0, count: data.count, data: data.data, msg: '' });
        } else {
            res.send({ code: 0, count: 0, data: [], msg: '' });
        }
    }).catch(e => {
        console.log(e);
        res.send({ code: 0, count: 0, data: [], msg: '' });
    });
});

router.get('/getcompanyById', function (req, res) {
    var _id = req.query._id;
    read.getCompanyById(_id).then(function (data) {
        if (!!data) {
            res.send(data);
        } else {
            res.send({});
        }
    }).catch(e => {
        console.log(e);
        res.send({});
    });
});

router.post('/updateCompanyPosition', function (req, res) {
    var _id = req.body._id;
    var lat = req.body.lat;
    var lng = req.body.lng;
    var city = req.body.city;
    var district = req.body.district;
    update.updateCompanyPosition({ _id: _id, position: { lat: lat, lng: lng }, city: city, district: district }).then(function (data) {
        res.send(data);
    }).catch(function (e) {
        console.error(e);
        res.send({});
    })
});

router.post('/updateCompanyStatus', function (req, res) {
    var _ids = req.body['_ids'];
    var bdStatus = req.body.bdStatus;
    if (!!!_ids) {
        res.send({});
    }
    update.updateCompanyStatus({ _ids: _ids.split(','), bdStatus: bdStatus }).then(function (data) {
        res.send(data);
    }).catch(function (e) {
        console.error(e);
        res.send({});
    })
});

router.post('/deleteCompanyById', function (req, res) {
    var _id = req.body._id;
    update.deleteCompany({ _id: _id }).then(function (data) {
        res.send(data);
    }).catch(function (e) {
        console.error(e);
        res.send({});
    })
});

router.post('/updateCompanyInfo', async (req, res) => {
    let id = req.body.id;
    let field = req.body.field;
    if (!!!id || !!!field) {
        res.send({});
    }
    try {
        let data = await update.updateCompanyInfo({
            id: id,
            field: field,
            value: req.body.value
        });
        res.send(data);
    } catch (e) {
        console.error(e);
        res.send({});
    }
});

router.get('/onelevel', function (req, res) {
    res.send([]);
});

router.get('/charts', function (req, res, next) {
    var page;
    page = swig.renderFile('dist/manage/charts.html', {
        html: ""
    });
    res.send(page);
});

router.get('/tables', function (req, res, next) {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;

    read.getAverageSalaryInfo().then(board => {
        year = board.year;
        month = board.month;
        read.getTableRank(year, month).then(ret => {
            res.render('tables', ret);
        }).catch(e => {
            res.render('tables', { "errorMsg": e });
        });
    }).catch(e => {
        console.log(e);
        res.render('tables', { "errorMsg": e });
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

router.get('/controlpage', function (req, res, next) {
    var page;
    page = swig.renderFile('dist/manage/controlpage.html', {
        html: ""
    });
    res.send(page);
});

router.get('/questions', function (req, res, next) {
    var page;
    page = swig.renderFile('src/manage/questions.html', {
        html: ""
    });
    res.send(page);
});

router.get('/questionForm', function (req, res, next) {
    var page;
    page = swig.renderFile('src/manage/questionForm.html', {
        html: ""
    });
    res.send(page);
});

router.post('/saveQuestion', function (req, res) {
    try {
        if (!!req.body['answers']) {
            req.body['answers'] = JSON.parse(req.body['answers']);
        }
        console.log(req.body);
        update.saveQuestion(req.body).then(function (data) {
            res.send(data);
        }).catch(function (e) {
            console.error(e);
            res.send({});
        })
    } catch (e) {
        console.error(e);
        res.send({});
    }
});

router.get('/listQuestions', function (req, res) {
    var page = req.query.page;
    var limit = req.query.limit;
    var status = req.query.status;

    if (!!page) page = parseInt(page);
    if (!!limit) limit = parseInt(limit);
    read.listQuestions(page, limit, status).then(function (data) {
        if (!!data) {
            res.send({ code: 0, count: data.count, data: data.data, msg: '' });
        } else {
            res.send({ code: 0, count: 0, data: [], msg: '' });
        }
    }).catch(e => {
        console.log(e);
        res.send({ code: 0, count: 0, data: [], msg: '' });
    });
});

router.post('/deleteQuestionById', function (req, res) {
    var _id = req.body._id;
    update.deleteCompany({ _id: _id }).then(function (data) {
        res.send(data);
    }).catch(function (e) {
        console.error(e);
        res.send({});
    })
});

router.get('/answers', function (req, res, next) {
    var page;
    page = swig.renderFile('dist/manage/answers.html', {
        html: ""
    });
    res.send(page);
});

router.post('/publishBoard', async (req, res) => {
    try {
        let data = await update.publishBoard();
        res.send(data);
    } catch (e) {
        console.error(e);
        res.send({});
    }
});

router.post('/saveTagCloud', async (req, res) => {
    let now = new Date();
    let year = now.getFullYear() + '';
    let month = now.getMonth() + 1 + '';
    let data = req.body.data;
    try {
        let result = await update.insertTagCloudData(year, month, data);
        res.send(result);
    } catch (e) {
        console.error(e);
        res.send({});
    }
});

router.post('/savePublishContent', async (req, res) => {
    let newUrl = req.body.url;
    try {
        let result = await update.getPublishContent(newUrl);
        res.send(result);
    } catch (e) {
        console.error(e);
        res.send({});
    }
});

router.get('/pagecompanyalias', (req, res) => {
    let page = swig.renderFile('dist/manage/companyalias.html', {
        html: ''
    });
    res.send(page);
});

router.get('/listCompanyAlias', async (req, res) => {
    let page = req.query.page;
    let limit = req.query.limit;
    let search = req.query.search;
    try {
        if (!!page) page = parseInt(page);
        if (!!limit) limit = parseInt(limit);
        let data = await read.getCompanyAliasList(page, limit, search);
        if (!!data) {
            res.send({ code: 0, count: data.count, data: data.data, msg: '' });
        } else {
            res.send({ code: 0, count: 0, data: [], msg: '' });
        }
    } catch (e) {
        console.error(e);
        res.send({ code: 0, count: 0, data: [], msg: '' });
    }
});

router.post('/updateCompanyAlias', async (req, res) => {
    let id = req.body._id;
    let alias = req.body.alias;
    if (!id || !alias) {
        res.send({ n: 0 });
    } else {
        try {
            let data = await update.updateCompanyAlias(id, alias);
            res.send(data);
        } catch (e) {
            console.error(e);
            res.send({});
        }
    }
});

router.post('/deleteCompanyAliasById', async (req, res) => {
    let id = req.body._id;
    if (!id) {
        res.send({ n: 0 });
    } else {
        try {
            let data = await update.deleteCompanyAlias(id);
            res.send(data);
        } catch (e) {
            console.error(e);
            res.send({});
        }
    }
});

router.get('/pageJobs', function (req, res, next) {
    var page;
    page = swig.renderFile('dist/manage/jobs.html', {
        html: ""
    });
    res.send(page);
});

router.get('/listJobs', function (req, res) {
    var page = req.query.page;
    var limit = req.query.limit;
    let company = req.query.company;

    if (!!page) page = parseInt(page);
    if (!!limit) limit = parseInt(limit);
    read.getJobList(page, limit, company).then(function (data) {
        if (!!data) {
            res.send({ code: 0, count: data.count, data: data.data, msg: '' });
        } else {
            res.send({ code: 0, count: 0, data: [], msg: '' });
        }
    }).catch(e => {
        console.log(e);
        res.send({ code: 0, count: 0, data: [], msg: '' });
    });
});

router.post('/updateJobInfo', async (req, res) => {
    let id = req.body.id;
    let field = req.body.field;
    if (!!!id || !!!field) {
        res.send({});
    }
    try {
        let data = await update.updateJobInfo({
            id: id,
            field: field,
            value: req.body.value
        });
        res.send(data);
    } catch (e) {
        console.error(e);
        res.send({});
    }
});

module.exports = router;
