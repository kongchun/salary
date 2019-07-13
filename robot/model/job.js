'use strict';
import mongodb from "mongodb";
import { getCompanyAlias } from "../utils/ETL/companyETL.js"

export default class Job{
    constructor({_id,jobId=null,job=null,companyId=null,company=null,companyAlias=null,addr=null,info=null,workYear=null,education=null,salary=null,time=null,content=null,source=null,city=null,kd=null,pageContent=null,companyDetail=null,companyLogo=null}) {
       this._id = _id?mongodb.ObjectId(_id):new mongodb.ObjectId();
       this.id = jobId+source;
       this.jobId = jobId;
       this.job = job;
       this.companyId = companyId;
       this.company = company;
       this.companyAlias =  companyAlias;
       this.companyDetail = companyDetail;
       this.companyLogo = companyLogo;
       this.addr = addr;
       this.workYear = workYear;
       this.education = education; 
       this.salary = salary;
       this.time = time;
       this.info = info;
       this.content = content; //详情的的content
       this.pageContent = pageContent; //来自列表的content
       this.source = source;
       this.city = city;
       this.kd = kd;
       this.robotTime = new Date();
    }
}
