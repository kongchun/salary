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
const year = "2019";
const month = "06";

var main = new Main(db,table,year,month);


main.addConfig(new FiveOneJob(5)); //51Job  10
main.addConfig(new baidu(5)); //baidu  10
main.addConfig(new ZhaoPin(5)); //智联招聘 10
// main.addConfig(new Lagou(1)); //拉钩 10 (baidu/包含)
main.addConfig(new ZhiPin(1)); //BOSS直聘 参数不要大于2 (baidu 包含)

//main.robotData();
//main.analyseCompany();

main.stepEtl().then(()=>{
	show(db,table,year,month);
})

//main.stepToJob()


//show(db,table,year,month);
//main.reInfo();
//============================

function show(db,table,year,month){
	var view = new ViewData(db,table,year,month);
	view.show();
}
