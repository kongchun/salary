var db = require('../../iRobots/db.js')("127.0.0.1", "kongchun");
import Lagou from "./source/lagou/config.js";
import Jobui from "./source/jobui/config.js";
import FiveOneJob from "./source/51job/config.js";
import ZhaoPin from "./source/zhaopin/config.js";
import ZhiPin from "./source/zhipin/config.js";
import baidu from "./source/baidu/config.js";

import Main from "./main.js";
import ViewData from "./viewData.js";
import Table from "./model/table.js";

const city = "苏州";
const kd = "前端";


var table = new Table({});
var main = new Main(db,table);


//main.addConfig(new FiveOneJob(1)); //51Job  10
main.addConfig(new baidu(2)); //baidu  10


//main.addConfig(new ZhaoPin(1)); //智联招聘 10
//main.addConfig(new Lagou(1)); //拉钩 10 (baidu/包含)
//main.addConfig(new ZhiPin(1)); //BOSS直聘 参数不要大于2 (baidu 包含)

const year = "2018";
const month = "8";

//main.stepList();
//main.stepToJob(year,month);
//main.stepInfo();
//main.stepCompare(year,month);
//main.noLoadToRepertory();
//main.stepBdLoad();

//main.stepEtl();
show(db,table,year,month);

//=================================

// main.start().catch(function(e){
// 	console.log(e);
// })

// main.list().catch(function(e){
// 	console.log(e);
// });

//main.pageToJob();
//main.timeFilter();
//main.clearoutTime(year,month);
//main.info();
//main.groupCompany();
//main.compareCompany();
//main.loadPosition();

//main.loadGeo();
//main.fixedGeo(); 
//main.filterGeo();


//main.positionToJob();
//main.transform();

//main.reInfo();
//







//============================

function show(db,table,year,month){
	var view = new ViewData(db,table,year,month);
	view.show();
}
//view.average();
//view.chart();
//view.tech();
// //
//

