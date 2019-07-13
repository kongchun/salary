'use strict';
import mongodb from "mongodb";
export default class Company{
    constructor({_id,alias=null,company=null,addr=null,position=true,city=null,kd=null}) {
       this._id = _id?mongodb.ObjectId(_id):new mongodb.ObjectId();
       this.company = company;
       this.alias = alias;
       this.addr = addr;
       this.count = count;
       this.position = position;
       this.city = city;
       this.kd = kd;
    }
}


