import Page from "./model/page.js";

import { filter as jobFilter } from "./utils/filter/jobFilter.js";
import { filter as companyFilter } from "./utils/filter/companyFilter.js";
import { filter as timeFilter } from "./utils/filter/timeFilter.js";

export default class Container {
    constructor({ db, table, config, year, month }) {
        this.db = db;
        this.loader = config.loader;
        this.parse = config.parse;
        this.source = config.source;
        this.maxSize = config.pageSize;
        this.city = config.city;
        this.kd = config.kd;
        this.etl = config.etl;
        this.table = table;
        this.year = year;
        this.month = month;
    }

    //获取最大分页数
    async getMaxSize(maxSize) {
        let {content,url} = await this.loader.list(1);
        return this.parse.maxPageSize(maxSize, content);
    }

    async browserClose(){
        await this.loader.browserClose();
    }

    async list() {
        let dataList = [];
        let maxSize = await this.getMaxSize(this.maxSize);
        for (let i = 1; i <= maxSize; i++) {
            let {content,url} = await this.loader.list(i);
            let db_page = new Page({
                url: url,
                content: content,
                city: this.city,
                kd: this.kd,
                source: this.source
            })
            dataList.push(db_page);
        }
        await this.db.open(this.table.page);
        await this.db.collection.insertMany(dataList);
        this.db.close();
        console.log(this.source + " page Loaded");
        return;
    }

    async pageToJob() {
        const dataset = await this.getNewPage();
        let jobs = [];
        dataset.forEach((it) => {
            jobs.push(...this.parse.list(it.content));
        })

        jobs = this.filterJob(jobs);
        await this.insertJob(jobs);
        return;
    }

    //获取未解析的页面
    async getNewPage() {
        await this.db.open(this.table.page);
        const dataset = await this.db.findToArray({ isNew: true, source: this.source, city: this.city, kd: this.kd }, { content: 1 });
        await this.db.collection.updateMany({ isNew: true, source: this.source, city: this.city, kd: this.kd }, { $set: { isNew: false } });
        this.db.close();
        return dataset;
    }
    //过滤
    filterJob(jobs) {
        //console.log(jobs.length)
        jobs = timeFilter(jobs, this.year, this.month); //根据时间过滤
        //console.log(jobs.length,"y")
        jobs = jobFilter(jobs);  //根据职位过滤
        //console.log(jobs.length,"name")
        jobs = companyFilter(jobs);  //根据公司过滤
        console.log(jobs.length,"jobSize",this.source);
        //jobs=[jobs[0]] || []
        return jobs;
    }

    //插入job
    async insertJob(data) {
        if(data.size==0){
            return;
        }
        await this.db.open(this.table.job);
        await this.db.insertUnique(data, "id");
        this.db.close();
        console.log(this.source + " pageToJob Loaded");
    }

    //--------------------------------------------------------------------------
    async info() {
        await this.getContent();
        await this.parseInfo();
        await this.transform();
    }
    //加载详情信息
    async getContent() {
        await this.db.open(this.table.job);
        const jobList = await this.db.findToArray({ content: null, source: this.source, city: this.city, kd: this.kd });
        for (const job of jobList) {
            const {content,url} = await this.loader.info(job.jobId);
            this.db.updateById(job._id, { content,url});
        }
        this.db.close();
        console.log(this.source + " content Loaded finish");
    }

    //解析内容中的详情信息
    async parseInfo() {
        await this.db.open(this.table.job);
        const jobList = await this.db.findToArray({ source: this.source, city: this.city, kd: this.kd }, { content: 1 ,pageContent:1});
        for (const job of jobList) {
            await this.db.updateById(job._id, this.parse.info(job.content,job.pageContent))
        }
        this.db.close();
        console.log(this.source + " parseInfo finish");
    }

    //数据清洗ELT
    async transform() {
        await this.db.open(this.table.company_alias);
        var company_alias = await this.db.findToArray({});
        this.db.close();

        await this.db.open(this.table.job);
        const jobList = await this.db.findToArray({ source: this.source, city: this.city, kd: this.kd }, { company: 1, companyAlias: 1, workYear: 1, education: 1, salary: 1, job: 1, info: 1 });
        for (const job of jobList) {
            await this.db.updateById(job._id, this.etl.all(job,{companyAlias:company_alias}));
        }
        this.db.close();
        console.log(this.source + " ELT finish");
    }

}