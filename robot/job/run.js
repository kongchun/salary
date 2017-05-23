var db = require('../../../iRobots/db.js')("127.0.0.1", "kongchun");
import Lagou from "./source/lagou/config.js";
import Main from "./main.js";
import ViewData from "./viewData.js";

var city = "苏州";
var kd = "前端";
var year = "2017.05"

var main = new Main(db);
main.addConfig(new Lagou(2));
//main.list();
//main.pageToJob();
//main.info();
//main.groupCompany();
//main.compareCompany();
//main.position();
//main.loadGeo();
//main.fixedGeo();
//main.filterGeo();
//main.positionToJob();
//main.transform();

var view = new ViewData(db,year);
//view.average();
//view.chart();
//view.tech();