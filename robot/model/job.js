'use strict';
import mongodb from "mongodb";
import { getCompanyAlias } from "../utils/ETL/companyETL.js"

export default class Job{
    constructor({_id,jobId=null,job=null,companyId=null,company=null,addr=null,info=null,workYear=null,education=null,salary=null,time=null,content=null,source=null,city=null,kd=null}) {
       this._id = _id?mongodb.ObjectId(_id):new mongodb.ObjectId();
       this.id = jobId+source;
       this.jobId = jobId;
       this.job = job;
       this.companyId = companyId;
       this.company = company;
       this.companyAlias = getCompanyAlias(company);
       this.addr = addr;
       this.workYear = workYear;
       this.education = education; 
       this.salary = salary;
       this.time = time;
       this.info = info;
       this.content = content;
       this.source = source;
       this.city = city;
       this.kd = kd;
       this.robotTime = new Date();
    }
}
