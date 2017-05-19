var db = require('../../../iRobots/db.js')("127.0.0.1", "kongchun");
import Lagou from "./source/lagou/config.js";
import Main from "./main.js";

var main = new Main(db);
main.addConfig(new Lagou(2));
main.run();