'use strict';
import mongodb from "mongodb";
export default class Job{
    constructor({_id,jobId=null,job=null,companyId=null,company=null,addr=null,workYear=null,education=null,salary=null,time=null,content=null,source=null}) {
       this._id = _id?mongodb.ObjectId(_id):new mongodb.ObjectId();
       this.jobId = jobId;
       this.job = job;
       this.companyId = companyId;
       this.company = company;
       this.addr = addr;
       this.workYear = workYear;
       this.education = education; 
       this.salary = salary;
       this.time = time;
       this.content = content;
       this.source = source;
    }
}
