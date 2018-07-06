var express = require('express');
var router = express.Router();
var swig = require('swig');

/* GET home page. */
router.get('/', function(req, res, next) {
    var page ;
    page = swig.renderFile('dist/index.html', {
        html: ""
    });
    res.send(page);
});

router.get('/welcome', function(req, res, next) {
    var page ;
    page = swig.renderFile('dist/index.html', {
        html: ""
    });
    res.send(page);
});


router.get('/distribution', function(req, res, next) {
    var page ;
    page = swig.renderFile('dist/index.html', {
        html: ""
    });
    res.send(page);
});

router.get('/charts', function(req, res, next) {
    var page ;
    page = swig.renderFile('dist/charts/datashow.html', {
        html: ""
    });
    res.send(page);
});


module.exports = router;
