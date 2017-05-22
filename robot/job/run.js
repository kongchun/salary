var db = require('../../../iRobots/db.js')("127.0.0.1", "kongchun");
import Lagou from "./source/lagou/config.js";
import Main from "./main.js";

var main = new Main(db);
main.addConfig(new Lagou(2));
//main.list();
//main.pageToJob();
//main.info();
//main.groupCompany();
//main.compareCompany();
//main.position();
//main.loadGeo();
main.fixedGeo();