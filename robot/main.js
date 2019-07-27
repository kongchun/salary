import Container from "./Container.js";
import { addrToGeoFull,geoToCityAndDistrict} from "./utils/bdHelper.js";
import {filter as positionFilter} from "./utils/ETL/positionETL.js";
import StatisticData from "./statistic/statisticData.js";

const aliasSync = require('./utils/aliasSync');

export default class Main {
    constructor(db, table, year, month) {
        this.db = db;
        this.table = table;
        this.containerList = [];
        this.year = year;
        this.month = month;
    }

    addConfig(config) {
        var container = new Container({ db: this.db, table: this.table, config: config, year: this.year, month: this.month });
        this.containerList.push(container);
    }

    //抓取数据完成
    async robotData() {
        await this.stepList();
        await this.stepToJob();
        await this.stepInfo();
        console.log("robotData flinsh")
    }

    async analyseCompany() {
        await this.transform();
        await this.groupCompany();
        await this.parseFromJobs();
        await this.compareCompany();
        await this.compareAddress();
        await this.loadGeo();
        await this.fixedGeo();
        await this.etlDistrict();
        await this.noLoadToRepertory();
        console.log("analyseCompany flinsh")
    }

    async statistic(){
        await this.compareCompany();
        await this.positionToJob();
        var statisticData = new StatisticData(this.db,this.table,this.year,this.month);
	    statisticData.show();
    }


    //获取职位列表
    async stepList() {
        //加载列表
        for (const item of this.containerList) {
            await item.list();
        }
        console.log("StepList finish");
    }

    //列表转换职位
    async stepToJob() {
        for (const item of this.containerList) {
            await item.pageToJob();
        }
        console.log("StepToJob finish");
    }


    //职位详细信息
    async stepInfo() {
        for (const item of this.containerList) {
            await item.info();
        }
        console.log("stepInfo finish");
    }

    async transform(){
        for (const item of this.containerList) {
            await item.transform();
        }
        console.log("transform finish");
    }

    //bdStatus：
    //0-未识别
    //1-自动识别
    //2-库识别
    //3-地图识别
    //99-手动审核
    //77-回收站

    
    async groupCompany() {
        
        await this.db.open(this.table.job);
        const dataSet = await this.db.collection.group({
            "companyAlias": true
        }, {}, { count:0},new this.db.Code(
             function (doc, prev) {
                prev.count++
            }
            )
        );

        this.db.close();

        await this.db.open(this.table.company);
        await this.db.collection.remove({});
        await this.db.collection.insertMany(dataSet);
        this.db.close();
        console.log("groupCompany finish");
    }

    //根据别名聚合公司
    async parseFromJobs(){
        await this.db.open(this.table.company);
        const companyList = await this.db.findToArray({}, { companyAlias: 1});
        this.db.close();
        for (const company of companyList) {
            const data = await this.parseCompanyFromJob(company)

            await this.db.open(this.table.company);
            await this.db.updateById(company._id, data);
        }
        this.db.close();
        console.log("parseCompanyFromJobs finish");
    }

    //解析聚合公司展示
    async parseCompanyFromJob(it){
        const companyAlias = it.companyAlias;
        await this.db.open(this.table.job);
        const jobs = await this.db.findToArray({companyAlias:companyAlias});
        this.db.close();


        let company,alias,logo=null,salary=0,description,position=null,addr=null,count=0,bdStatus=0,companyId=null,source;
        jobs.map((job)=>{
            companyId = (!companyId)?job.companyId:companyId;
            source = (companyId==job.companyId)?job.source:source;
            company = job.company;
            alias = job.companyAlias;
            logo = (!logo)?job.companyLogo:logo;
            salary = (salary>job.average)?salary:job.average;
            addr = findBeseString(addr,job.addr);
            description= findBeseString(description,job.companyDetail);
            position = job.position;
            bdStatus = !position?0:1;
        });
        return {company,alias,logo,salary,description,position,addr,bdStatus,companyId,source};

        function findBeseString(t1,t2){
            if(t1==null){
                return t2;
            }
            if(t2==null){
                return t1;
            }
            return t1.length>t2.length?t1:t2;
        }
    }

    //从系统库中比较公司
    async compareCompany(){
        await this.db.open(this.table.repertoryCompany);
        const dataset = await this.db.collection.find({}).toArray();
        this.db.close();
        await this.db.open(this.table.company);
      
        for (const company of dataset) {

            const alias = company.alias;
            const i = await this.db.collection.findOne({
                alias: alias
            })
            if (!i) continue;
            await this.db.updateById(i._id, {
                position: i.position,
                addr:(!i.addr)?i.addr:null,
                city: i.city,
                district: i.district,
                bdStatus:2,
                noLoad:true
            })
        }
        this.db.close()
        console.log("compareCompany finish") 
    }

    async compareAddress(){
        await this.db.open(this.table.address);
        var RegExpPositionFilter = await this.db.findToArray({});
        this.db.close();

        function getPositionByAddr(address){
            let city=null,district=null,position=null,bdStatus=2;
            RegExpPositionFilter.forEach((x) => {
                if (address.match(x.reg)) {
                    //console.log("regmatch:"+x.reg);
                    city = x.city;
                    district = x.district;
                    position = x.position;
                }
            })
            //console.log(address,position,city,district);
            return {district,position,city,bdStatus}
        }

        await this.db.open(this.table.company);
        const companyList = await this.db.findToArray({position: null,addr:{$ne:null}}, { addr:1});
        for (const company of companyList) {
            const t = getPositionByAddr(company.addr);
            if(t.position){
                await this.db.updateById(company._id, t);
            }
        }
        this.db.close();
        console.log("compareAddress finish");
    }

    //从百度地图加载
    async loadGeo() {
        await this.db.open(this.table.company);
        //解决根据地址查
        const addrs = await this.db.findToArray({position:null,addr:{$ne:null},noLoad:null},{addr:1});
        await updateGeo(this,addrs,"addr");
       
        //根据名称查
        // const names = await this.db.findToArray({position:null,company:{$ne:null},noLoad:null},{company:1});
        // await updateGeo(this,names,"name");
       
        this.db.close();

        console.log("loadGeo finish");

        async function updateGeo(context,arr,key){
            for (const it of arr) {
                let {position,city,district} = await addrToGeoFull(it[key]); //获取百度坐标
                await context.db.updateById(it._id, {position,city,district,bdStatus:3})
            }
        }
    }

    async fixedGeo() {
        //console.log(1);
        await this.db.open(this.table.company);
        //console.log(2);
        let arr = await this.db.findToArray({position: { $ne: null }, district: null, bdStatus: 3}, {position: 1 });
        for (const data of arr) {
            let cityAndDistrict = await geoToCityAndDistrict(data.position);
            //console.log(cityAndDistrict)
            await this.db.updateById(data._id, cityAndDistrict);
        }
        this.db.close();
        console.log("fixedGeo success");
    }

    async etlDistrict(){
        await this.db.open(this.table.company);
        const list = await this.db.findToArray({bdStatus:3},{addr:1,district:1,city:1});
        for (const it of list) {
            let {city,district} = positionFilter(it); //获取百度坐标
            await this.db.updateById(it._id, {city,district})
        }
        this.db.close();
        console.log("ETLDistrict finish");
    }

    //TODO:这里可以优化，如果部分属性有更新那么我们需要去刷新。
    async noLoadToRepertory(){

        //未在库中的，加入库
       await this.db.open(this.table.company);
       const data = await this.db.findToArray({noLoad: null});
       this.db.close();
       
       if(data.length == 0){
         return;
       }

       await this.db.open(this.table.repertoryCompany);
       await this.db.collection.insertMany(data);
       this.db.close();

       //已在库中的 如果有信息更新那么更新信息
       await this.db.open(this.table.company);
       const ALLCompany = await this.db.findToArray({noLoad: true});
       this.db.close();

      
       await this.db.open(this.table.repertoryCompany);
       for(const it of ALLCompany){
            const nologo = await this.db.collection.findOne({alias: it.alias,logo:null},{alias:1});
            if(nologo){
                await this.db.updateById(nologo._id, {logo:it.logo});
            }
            const nodescription = await this.db.collection.findOne({alias: it.alias,description:null},{aliass:1});
            if(nodescription){
                await this.db.updateById(nodescription._id, {description:it.description});
            }
       }
       this.db.close();

        await aliasSync(this.db);
        
       console.log("noLoadToRepertory success");

    }
    
    async positionToJob(){
        await this.db.open(this.table.company);
        let arr = await this.db.collection.find({"position":{"$ne":null},bdStatus:{"$ne":77}}, {
            position: 1,
            alias: 1,
            district:1,
            _id: 0
        }).toArray();
        this.db.close();
        await this.db.open(this.table.job);
        for(const i of arr){
            await this.db.collection.updateMany({
                companyAlias: i.alias,
                position:null
            }, {
                $set: {
                    district:i.district,
                    position: i.position
                }
            })
        }
        this.db.close();
        console.log("positionToJob success");
    }
}