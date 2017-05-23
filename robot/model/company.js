'use strict';
import mongodb from "mongodb";
export default class company{
    constructor({_id,url=null,company=null,addr=null,position=true,city=null,kd=null}) {
       this._id = _id?mongodb.ObjectId(_id):new mongodb.ObjectId();
       this.company = company;
       this.addr = addr;
       this.count = count;
       this.position = position;
       this.noLoad = false;
       this.city = city;
       this.kd = kd;
    }
}


