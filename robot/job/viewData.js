import helper from "../../../iRobots/helper.js";
import Container from "./Container.js";
import Company from "./model/Company.js";
import { addrToGeo, geoToCityAndDistrict } from "./utils/bdHelper.js";



export default class ViewData {
    constructor(db, year) {
        this.db = db;
        this.year = year;
    }

    average() {
        this.db.close();
        return this.db.open("job").then(() => {
            return this.db.findToArray({}, { average: 1 })
        }).then((data) => {
            this.db.close()
            var count = data.length;
            var total = 0;
            data.forEach((i) => {
                total += i.average
            });
            console.log(total, count)
            var average = total / count;
            //console.log(average.toFixed(2))
            return (average.toFixed(2))
        }).then((value) => {
            this.db.close();
            return this.db.open("year").then(() => {
                return this.db.collection.findOne({
                    year: this.year
                })
            }).then((data) => {
                console.log(this.year, value)
                if (data) {
                    return this.db.collection.update({
                        year: this.year
                    }, {
                        $set: {
                            value: value
                        }
                    })
                } else {
                    return this.db.collection.insert({
                        year: this.year,
                        value: value
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
        return this.db.open("job").then(() => {
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
            console.log("=========")
            console.log(JSON.stringify(obj))
            console.log("=========")
            console.log(JSON.stringify(arr))
        }).then(() => {
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
            }, true)
        }).then((data) => {
            var arr = []
            data.forEach((i) => {
                arr.push({
                    "label": i.eduRange,
                    "count": i.count
                })
            })

            console.log("=========")
            console.log(JSON.stringify(arr))
        }).then(() => {
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
            }, true)
        }).then((data) => {
            this.db.close()
            var arr = []
            data.forEach((i) => {
                arr.push({
                    "label": i.yearRange,
                    "count": i.count
                })
            })

            console.log("=========")
            console.log(JSON.stringify(arr))
            return;
        }).catch(function(e) {
            this.db.close()
            console.log(e)
        })
    }

    tech() {
        let techCount ={};
        return this.db.open("job").then(() => {
            return this.db.collection.find({
                content: {
                    $ne: null
                }
            }, {
                content: 1
            }).toArray()
        }).then(function(arr) {
            console.log(arr.length)
            return helper.iteratorArr(arr, (data) => {
                var content = (data.content).toLowerCase();


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
            techCount["angular"] = techCount["ng"] - techCount["mongothis.db"]
            delete techCount['jq'];
            delete techCount['ng'];
            delete techCount['js'];

            var arr = [];
            for (let prop in techCount) {

                arr.push({
                    tech: prop,
                    type: TECH[prop],
                    count: techCount[prop]
                });
            }

            return this.db.open("tech").then(() => {
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
    css: "基础",
    ajax: "基础",
    json: "基础",
    webrtc: "基础",
    websocket: "基础",
    js: "基础",
    WebGL: "基础",

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
    NOSQL: "数据库"
}
