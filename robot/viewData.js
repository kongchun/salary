import helper from "../../iRobots/helper.js";
import Container from "./Container.js";
import Company from "./model/Company.js";
import { addrToGeo, geoToCityAndDistrict } from "./utils/bdHelper.js";



export default class ViewData {
    constructor(db, table,year,month) {
        this.db = db;
        this.year = year;
        this.month = month;
        this.table = table;
    }
    show(){
        return this.average().then(()=>{
            return this.chart();
        }).then(()=>{
            return this.tech();
        })
    }
    average() {
        this.db.close();
        return this.db.open(this.table.job).then(() => {
            return this.db.findToArray({}, { average: 1 })
        }).then((data) => {
            this.db.close()
            var count = data.length;
            var total = 0;
            data.forEach((i) => {
                if(i.average>0){
                    total += i.average
                }else{
                    count--
                }
            });
            console.log(total, count)
            var average = total / count;
            return (average.toFixed(2))
        }).then((value) => {

            this.db.close();
            return this.db.open(this.table.board).then(() => {
                return this.db.collection.findOne({
                    year: this.year,
                    month:this.month
                })
            }).then((data) => {
                console.log(this.year+this.month, value)
                if (data) {
                    return this.db.collection.update({
                        year: this.year,
                        month:this.month
                    }, {
                        $set: {
                            average: parseFloat(value),
                            time:new Date(this.year,this.month-1),
                            publish:false
                        }
                    })
                } else {
                    return this.db.collection.insert({
                        year: this.year,
                        month:this.month,
                        average: parseFloat(value),
                        time:new Date(this.year,this.month-1),
                        publish:false
                    })
                }
            })
        }).then(() => {
            this.db.close();
            console.log("average success");
            return;
        }).catch((e) => {
            this.db.close()
            console.log(e);
            return;
        })
    }


    chart() {
        this.db.close();
        return this.db.open(this.table.job).then(() => {
            return this.db.collection.group({
                'salaryRange': true
            }, {
                filter: {
                    $ne: true
                },
                position: {
                    $ne: null
                }
            }, {
                positions: [],
                "count": 0
            }, (doc, prev) => {
                prev.count++;
                var {
                    lat,
                    lng
                } = doc.position;
                prev.positions.push([lng, lat, 1])
            }, true)
        }).then((data) => {
            var obj = {}
            var arr = []
            data.forEach((i) => {
                obj[i.salaryRange] = i.positions
                arr.push({
                    "label": i.salaryRange,
                    "count": i.count
                })
            })

            return {points:obj,salaryRange:arr}
        }).then(({points,salaryRange}) => {
            return this.db.collection.group({
                'eduRange': true
            }, {
                filter: {
                    $ne: true
                }
            }, {

                "count": 0
            }, function(doc, prev) {
                prev.count++;
            }, true).then((data) => {
                var eduRange = []
                data.forEach((i) => {
                    eduRange.push({
                        "label": i.eduRange,
                        "count": i.count
                    })
                })
    
                return {points,salaryRange,eduRange};
            })

        }).then(({points,salaryRange,eduRange}) => {
            return this.db.collection.group({
                'yearRange': true
            }, {
                filter: {
                    $ne: true
                }
            }, {

                "count": 0
            }, function(doc, prev) {
                prev.count++;
            }, true).then((data) => {
                var yearRange = []
                data.forEach((i) => {
                    yearRange.push({
                        "label": i.yearRange,
                        "count": i.count
                    })
                })


                return {points,salaryRange,eduRange,yearRange};
            })
        }).then(({points,salaryRange,eduRange,yearRange}) => {
            return this.db.collection.group({
                'district': true
            }, {
                filter: {
                    $ne: true
                }
            }, {

                "count": 0
            }, function(doc, prev) {
                prev.count++;
            }, true).then((data) => {
                this.db.close()
                var districtRange = []
                data.forEach((i) => {
                    districtRange.push({
                        "label": i.district,
                        "count": i.count
                    })
                })


                return {points,salaryRange,eduRange,yearRange,districtRange};
            })
        }).then(({points,salaryRange,eduRange,yearRange,districtRange})=>{

            this.db.close();
            return this.db.open(this.table.board).then(() => {
                return this.db.collection.findOne({
                    year: this.year,
                    month:this.month
                })
            }).then((data) => {
                console.log(points)
                console.log(salaryRange)
                console.log(eduRange)
                console.log(yearRange)
                console.log(districtRange)
            
                return this.db.collection.update({
                    year: this.year,
                    month:this.month
                }, {
                    $set: {
                        points: points,
                        salaryRange:salaryRange,
                        eduRange:eduRange,
                        yearRange:yearRange,
                        districtRange:districtRange,
                        time:new Date(),
                        publish:false
                    }
                })
                
            })

        }).then(()=>{
            this.db.close();
            console.log("chart success");
            return;
        }).catch(function(e) {
            this.db.close()
            console.log(e)
        })
    }

    topTen(){
         this.db.close();
        
    }

    tech() {
        let techCount ={};
        return this.db.open(this.table.job).then(() => {
            return this.db.collection.find({
                info: {
                    $ne: null
                }
            }, {
                info: 1
            }).toArray()
        }).then(function(arr) {
            console.log(arr.length)
            return helper.iteratorArr(arr, (data) => {
                var content = (data.info).toLowerCase();


                for (let prop in TECH) {
                    if (!techCount[prop]) {
                        techCount[prop] = 0;
                    }

                    var text = prop.toLowerCase();
                    if (content.indexOf(text) > -1) {
                        techCount[prop]++;
                    }
                }
                //console.log(techCount)

                return Promise.resolve(data);
            })
        }).then(() => {
            this.db.close();
            techCount["javascript"] = techCount["javascript"] + techCount["js"] - techCount["json"];
            techCount["jquery"] = techCount["jq"];
            techCount["angular"] = techCount["ng"] - techCount["mongodb"]
            delete techCount['jq'];
            delete techCount['ng'];
            delete techCount['js'];

            var arr = [];
            for (let prop in techCount) {

                arr.push({
                    year:this.year,
                    month:this.month,
                    tech: prop,
                    type: TECH[prop],
                    count: techCount[prop]
                });
            }

            return this.db.open(this.table.tech).then(() => {
                return this.db.collection.remove({});
            }).then(() => {
                return this.db.collection.insertMany(arr);
            }).then(() => {
                this.db.close();
                return;
            })
        }).catch((e) => {
            this.db.close();
            console.log(e)
        })
    }

}



const TECH = {
    javascript: "基础",
    html: "基础",
    H5:"基础",
    css: "基础",
    ajax: "基础",
    json: "基础",
    webrtc: "基础",
    websocket: "基础",
    js: "基础",

    WebGL: "图形",
    Flash: "图形",
    canvas: "图形",
    svg: "图形",
    d3: "图形",
    echart: "图形",
    Three: "图形",
    ArcGIS: "图形",
    ChartJS: "图形",
    Highcharts: "图形",
    Flot: "图形",

    jq: "框架和库",
    jquery: "框架和库",
    zepto: "框架和库",
    prototype: "框架和库",
    handlebars:"框架和库",
    undersorce:"框架和库",
    lodash:"框架和库",

    bootstrap: "框架和库",
    MooTools: "框架和库",
    Dojo: "框架和库",
    YUI: "框架和库",
    Ext: "框架和库",
    Sencha: "框架和库",
    easyui: "框架和库",

    GWT: "MVVM",

    backbone: "MVVM",
    Knockout: "MVVM",
    riotjs:"MVVM",

    PhoneGap: "移动库",
    IONIC: "移动库",

    require: "基础",
    sea: "基础",
    common: "基础",

    react: "MVVM",
    vue: "MVVM",
    ng: "MVVM",
    angular: "MVVM",
    Redux: "MVVM",
    canJS:"MVVM",
    Ractive:"MVVM",

    node: "node",
    npm: "node",
    Express: "node",
    koa: "node",
    Hapi: "node",

    ECMAScript: "基础",
    ES5: "基础",
    ES6: "基础",
    CoffeeScript: "基础",
    TypeScript: "基础",

    Grunt: "构建",
    gulp: "构建",
    Bower: "构建",
    less: "构建",
    sass: "构建",
    webpack: "构建",
    Yeoman: "构建",
    fis: "构建",

    mysql: "数据库",
    mongodb: "数据库",
    Oracle: "数据库",
    Redis: "数据库",
    Memcache: "数据库",
    postgresql: "数据库",
    NOSQL: "数据库",

    karma:"测试",
    jasmine:"测试",
    protractor:"测试"
}
