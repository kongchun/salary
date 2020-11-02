const PUBLISH = false;

export default class StatisticData {
    constructor(db, table,year,month,types=['基础','框架和库','MVVM','图形','构建服务','数据库','其它','综合知识','浏览器','图形处理','工具','app','编程语言']) {
        this.db = db;
        this.year = year;
        this.month = month;
        this.table = table;
        this.types = types;
    }
    async show(){
        await this.average();
        await this.chart();
        await this.tech();
        await this.top();
    }

    async average() {
        try {
    
            await this.db.open(this.table.job);
            const data = await this.db.findToArray({filter:false}, { average: 1 });
            this.db.close();

            let count =0;
            let total = 0;

            data.forEach((i) => {
                if(i.average>0){
                    total += i.average
                    count++
                }
            });

            let average = parseFloat((total / count).toFixed(2));
            
            console.log(total, count,average);

            await this.db.open(this.table.board);
            var data = await this.db.collection.findOne({
                year: this.year,
                month:this.month
            })

            const setData = {
                average: parseFloat(average),
                time:new Date(this.year,this.month-1),
                year: this.year,
                month:this.month,
                publish:PUBLISH  //这里其实关系以及不大
            }

             if (data) {
                await this.db.collection.update({
                    year: this.year,
                    month:this.month
                }, {
                    $set: setData
                })
            } else {
                await this.db.collection.insert(setData)
            }
                
            this.db.close();
            console.log("average success");
        }catch(e){
            this.db.close()
            console.log(e);
            return;
        }
    }

    async chart() {
        try {
            this.db.close();
            await this.db.open(this.table.job);
            var data = await this.db.collection.group({
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
                if(doc.position==""){return}
                prev.count++;
                
                var {
                    lat,
                    lng
                } = doc.position;
                prev.positions.push([lng, lat, 1])
            }, true)


            var points = {};
            var salaryRange = [];
            data.forEach((i) => {
                points[i.salaryRange] = i.positions
                salaryRange.push({
                    "label": i.salaryRange,
                    "count": i.count
                })
            });
            console.log(points)
            //console.log(salaryRange)


            //eduRange;
            var data = await this.db.collection.group({
                'eduRange': true
            }, {
                filter: {
                    $ne: true
                }
            }, {

                "count": 0
            }, function(doc, prev) {
                prev.count++;
            }, true);

            var eduRange = []
            data.forEach((i) => {
                eduRange.push({
                    "label": i.eduRange,
                    "count": i.count
                })
            })
            console.log(eduRange);

            //yearRange
            var data = await this.db.collection.group({
                'yearRange': true
            }, {
                filter: {
                    $ne: true
                }
            }, {
                    "count": 0,
                    "sum": 0
                }, function (doc, prev) {
                    if(doc.average>0){
                        prev.count++;
                        prev.sum += doc.average;
                    }
            }, true)


            var yearRange = []
            data.forEach((i) => {
                console.log(i.yearRange,i.sum)
                yearRange.push({
                    "label": i.yearRange,
                    "count": i.count,
                    "average": Math.round(i.sum*100/i.count)/100
                })
            })
            console.log(yearRange);

            //districtRange
            var data = await this.db.collection.group({
                'district': true
            }, {
                filter: {
                    $ne: true
                },
                district:{
                    $ne:null
                }
            }, {
                "count": 0
            }, function(doc, prev) {
                prev.count++;
            }, true)


            var districtRange = []
            data.forEach((i) => {
                districtRange.push({
                    "label": i.district,
                    "count": i.count
                })
            })

            console.log(districtRange);

            this.db.close();
            await this.db.open(this.table.board);
            var data = await this.db.collection.findOne({
                year: this.year,
                month: this.month
            })


            if (data) {
                await this.db.collection.update({
                    year: this.year,
                    month: this.month
                }, {
                    $set: {
                        year: this.year,
                        month: this.month,
                        points: points,
                        salaryRange: salaryRange,
                        eduRange: eduRange,
                        yearRange: yearRange,
                        districtRange: districtRange,
                        time: new Date(this.year, this.month - 1),
                        publish: false
                    }
                })
            } else {
                await this.db.collection.insert({
                    year: this.year,
                    month: this.month,
                    points: points,
                    salaryRange: salaryRange,
                    eduRange: eduRange,
                    yearRange: yearRange,
                    districtRange: districtRange,
                    time: new Date(this.year, this.month - 1),
                    publish: false
                })
            }

            this.db.close();
            console.log("chart success");
        } catch (e) {
            this.db.close()
            console.log(e);
            return;
        }
 
    }



    async top(){
        try {
            var toprank = await this.getTopRank(50);
            var detailRank = await this.getTechDetailRanks(this.types);
            var companyRank = await this.getAvgSarlyRank(50);
            var jobRank = await this.getCountJobRank(50);

            var year = this.year;
            var month = this.month;
            var types = this.types;
            var time = new Date();

            this.setTop({toprank,detailRank,companyRank,jobRank,types,year,month,time});
        }catch(e){
            console.error(error);
            throw error;
        }

    }

    async setTop(top){
     
        await this.db.open(this.table.top)
        var data = await this.db.collection.findOne({
            year: this.year,
            month:this.month
        })
        
        //console.log(JSON.stringify(top,null,4))
        if (data) {
            await this.db.collection.update({
                year: this.year,
                month:this.month
            }, {
                $set: top
            })
        } else {
            await this.db.collection.insert(top);
        }
       

        this.db.close();
        console.log("top success");
    
    }

    async getTopRank(limit=20){
        return await this.getTopRankDb(this.year,this.month,limit);
    }
    async getTechDetailRanks(types){
       var arr = [];
       for(var type in types){
         var k = await this.getTopRankDb(this.year,this.month,10,types[type]);
         arr.push(k);
        }
        console.log(arr.length);
        return arr;
    };
  
    getTopRankDb(year,month,limit,type) {
        this.db.close();
        var query = {year:year+'',month:month+''};
        if(!!type){
            query.type = type;
        }
        return this.db.open(this.table.tech).then((collection) =>{
            return collection.find(query,{tech:1,type:1,count:1}).sort({count:-1}).skip(0).limit(limit).toArray();
        }).then((data)=> {
            this.db.close();
            return data;
        }).catch((error) => {
            this.db.close();
            console.error(error)
            throw error;
        })
    };
    getAvgSarlyRank(limit) {
        this.db.close();
         var query = {bdStatus:{$ne:77}};
        return this.db.open(this.table.company).then((collection) =>{
            return collection.find(query,{company:1,alias:1,salary:1,_id:1}).sort({salary:-1}).skip(0).limit(limit).toArray();
        }).then((data)=> {
            this.db.close();
            return data;
        }).catch((error)=> {
            this.db.close();
            console.error(error)
            throw error;
        })
    };
    getCountJobRank(limit) {
        this.db.close();
        var query = {bdStatus:{$ne:77}};
        return this.db.open(this.table.company).then((collection)=> {
            return collection.find(query,{company:1,alias:1,count:1,_id:1}).sort({count:-1}).skip(0).limit(limit).toArray();
        }).then((data)=> {
            this.db.close();
            return data;
        }).catch((error)=> {
            this.db.close();
            console.error(error)
            throw error;
        })
    };

    topTen(){
         this.db.close();
        
    }

    async tech() {
        try{
            let techCount ={};
            await this.db.open(this.table.job);
            var arr =  await this.db.collection.find({
                info: {
                    $ne: null
                },
                etlTag: {
                    $ne: null
                }
            }, {
                info: 1,
                etlTag: 1
            }).toArray();
      
            this.db.close();

           // console.log(arr)

            arr.forEach((data) => {
                let tagArray = data.etlTag;
                for (let tag of tagArray) {
                    let keyWord = tag.toLowerCase();
                    let counted = false;
                    for (let prop in TECH) {
                        if (!techCount[prop]) {
                            techCount[prop] = 0;
                        }

                        var text = prop.toLowerCase();
                        if (keyWord === text) {
                            techCount[prop]++;
                            counted = true;
                            break;
                        }
                    }
                    if (!counted) {
                        if (!techCount[keyWord]) {
                            techCount[keyWord] = 1;
                        } else {
                            techCount[keyWord]++;
                        }
                    }
                }
            })


             techCount["javascript"] = techCount["javascript"] + techCount["js"] - techCount["json"];
                techCount["ES6+"] = techCount["ECMAScript"] 
                + techCount["ES6"] + techCount["ES7"]+techCount["ES8"]
                + techCount["ES2015"] + techCount["ES2016"]+techCount["ES2017"]+techCount["ES2018"];


                techCount["html"] = techCount["html"] + techCount["H5"];
                techCount["jquery"] = techCount["jq"];
                //techCount["angular"] = techCount["ng"] - techCount["mongodb"]
            
            //可能存在的tag
            if (techCount.hasOwnProperty('html5')) {
                techCount['html'] = techCount['html'] + techCount['html5'];
                delete techCount['html5'];
            }
            if (techCount.hasOwnProperty('xhtml')) {
                techCount['html'] = techCount['html'] + techCount['xhtml'];
                delete techCount['xhtml'];
            }
            if (techCount.hasOwnProperty('css3')) {
                techCount['css'] = techCount['css'] + techCount['css3'];
                delete techCount['css3'];
            }
            if (techCount.hasOwnProperty('angularjs')) {
                techCount['angular'] = techCount['angular'] + techCount['angularjs'];
                delete techCount['angularjs'];
            }
            if (techCount.hasOwnProperty('nodejs')) {
                techCount['node'] = techCount['node'] + techCount['nodejs'];
                delete techCount['nodejs'];
            }
            if (techCount.hasOwnProperty('vuejs')) {
                techCount['vue'] = techCount['vue'] + techCount['vuejs'];
                delete techCount['vuejs'];
            }
            if (techCount.hasOwnProperty('reactjs')) {
                techCount['react'] = techCount['react'] + techCount['reactjs'];
                delete techCount['reactjs'];
            }
            if (techCount.hasOwnProperty('requirejs')) {
                techCount['require'] = techCount['require'] + techCount['requirejs'];
                delete techCount['requirejs'];
            }

                delete techCount['jq'];
                delete techCount['ng'];
                delete techCount['js'];
                delete techCount['H5'];

                delete techCount["ECMAScript"];
                delete techCount["ES6"];
                delete techCount["ES7"];
                delete techCount["ES8"];
                delete techCount["ES9"];

                delete techCount["ES2015"];
                delete techCount["ES2016"];
                delete techCount["ES2017"];
                delete techCount["ES2018"];
            
            //无关词
            delete techCount['nbsp'];
            delete techCount['experience'];
            delete techCount['div'];
            delete techCount['pc'];
            delete techCount['net'];
            delete techCount['api'];
            delete techCount['mv'];
            delete techCount['com'];
            delete techCount['good'];
            delete techCount['development'];
            delete techCount['demo'];
                for(let tech in techCount){
                    if(techCount[tech] < 2){
                        delete techCount[tech];
                    }
                }

                var arr = [];
                for (let prop in techCount) {
                    arr.push({
                        year:this.year,
                        month:this.month,
                        tech: prop,
                        type: !!TECH[prop] ? TECH[prop] : '其它',
                        count: techCount[prop]
                    });
                };

                //console.log(arr);
             
                await this.db.open(this.table.tech);
                await this.db.collection.remove({});
                await this.db.collection.insertMany(arr);
                //console.log(arr);
                this.db.close();
               
        } catch (e) {
            this.db.close()
            console.log(e);
               
        }
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
    xml:"基础",
    dom:"基础",
    bom:"基础",

    WebGL: "图形",
    Flash: "图形",
    canvas: "图形",
    svg: "图形",
    d3: "图形",
    echarts: "图形",
    Three: "图形",
    ArcGIS: "图形",
    ChartJS: "图形",
    Highcharts: "图形",
    Flot: "图形",
    AntV:"图形",
    F2:"图形",
    G2:"图形",
    frappe:"图形",
    Recharts:"图形",
    sigma:"图形",
    mermaid:"图形",
    chartistJS:"图形",
    plotly:"图形",
    photoshop:"图形",

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
    extjs:"框架和库",
    elemenetui:"框架和库",
    elemenet:"框架和库",
    GWT: "MVVM",

    backbone: "MVVM",
    Knockout: "MVVM",
    riotjs:"MVVM",

    PhoneGap: "移动库",
    IONIC: "移动库",
    NativeScript: "移动库",
    Framework7: "移动库",
    Amaze: "移动库",
    weex: "移动库",
    Mint: "移动库",
    ratchet: "移动库",
    native:"移动库",
    hybrid:"移动库",

    require: "基础",
    sea: "基础",
    common: "基础",

    react: "MVVM",
    vue: "MVVM",
    ng: "MVVM",
    angular: "MVVM",
    angular2: "MVVM",
    Redux: "MVVM",
    canJS:"MVVM",
    Ractive:"MVVM",
    Polymer:"MVVM",
    Preact:"MVVM",
    Relay:"MVVM",
    Aurelia:"MVVM",
    dva:"MVVM",
    inferno:"MVVM",
    hyperapp:"MVVM",
    vuex:"MVVM",

    node: "构建服务",
    npm: "构建服务",
    Express: "构建服务",
    koa: "构建服务",
    Hapi: "构建服务",
    Meteor: "构建服务",
    Next: "构建服务",
    sails: "构建服务",
    keystone: "构建服务",
    mean: "构建服务",
    nuxt: "构建服务",
    egg: "构建服务",
    loopback: "构建服务",

    ECMAScript: "基础",
    "ES6+": "基础",
    ES6: "基础",
    ES7: "基础",
    ES8: "基础",
    ES9: "基础",
    es: "基础",

    ES2015: "基础",
    ES2016: "基础",
    ES2017: "基础",
    ES2018: "基础",

    CoffeeScript: "基础",
    TypeScript: "基础",

    Grunt: "构建服务",
    gulp: "构建服务",
    Bower: "构建服务",
    less: "构建服务",
    sass: "构建服务",
    webpack: "构建服务",
    Yeoman: "构建服务",
    fis: "构建服务",

    mysql: "数据库",
    mongodb: "数据库",
    Oracle: "数据库",
    Redis: "数据库",
    Memcache: "数据库",
    postgresql: "数据库",
    NOSQL: "数据库",
    store: "数据库",
    gum: "数据库",
    typeORM: "数据库",
    knex: "数据库",
    lowDB: "数据库",
    pouchDB: "数据库",
    rxDB: "数据库",
    postGraphile: "数据库",
    sequelize: "数据库",

    karma:"测试",
    jasmine:"测试",
    protractor:"测试",
    mock:"测试",

    web2:"综合知识",
    w3c:"综合知识",
    http:"综合知识",
    mvc:"综合知识",
    sql:"综合知识",
    linux:"综合知识",
    websocket:"综合知识",
    socket:"综合知识",
    devops:"综合知识",
    router:"综合知识",
    server:"综合知识",
    seo:"综合知识",

    php:"编程语言",
    c:"编程语言",
    python:"编程语言",
    ruby:"编程语言",
    java:"编程语言",

    android:"app",
    ios:"app",
    webapp:"app",
    mobile:"app",

    github:"工具",
    git:"工具",
    svn:"工具",
    dreamveaver:"工具",
    framework:"工具",

    photoshop:"图形处理",
    illustrator:"图形处理",
    ps:"图形处理",

    chrome:"浏览器",
    firefox:"浏览器",
    ie:"浏览器"
    
    
}
