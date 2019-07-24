import Database from "../../iRobots/db.js";
import Table from "./model/table.js";

import Main from "./main.js";

import FiveOneJob from "./source/51job/config.js";
import Baidu from "./source/baidu/config.js";
import ZhaoPin from "./source/zhaopin/config.js";
import ZhiPin from "./source/zhipin/config.js";

//tobeDel
import Lagou from "./source/lagou/config.js"; //反爬虫很厉害 
import Jobui from "./source/jobui/config.js"; //主要还是拉钩问题

var db = Database("127.0.0.1", "kongchun");
var table = new Table({});


const city = "苏州";
const kd = "前端";
const year = "2019";
const month = "07";


var main = new Main(db,table,year,month);
main.addConfig(new FiveOneJob(3,city,kd)); //51Job  10
main.addConfig(new ZhaoPin(3,city,kd)); //智联招聘 10
main.addConfig(new ZhiPin(1,city,kd)); //BOSS直聘 参数不要大于2 (baidu 包含)
main.addConfig(new Baidu(5,city,kd)); //baidu  5



//main.robotData();
//main.analyseCompany();
main.statistic();
