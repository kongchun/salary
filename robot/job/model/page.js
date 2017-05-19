'use strict';
import mongodb from "mongodb";
export default class Page{
    constructor({_id,url=null,content=null,source=null,isNew=true}) {
       this._id = _id?mongodb.ObjectId(_id):new mongodb.ObjectId();
       this.url = url;
       this.content = content;
       this.source = source;
       this.isNew = isNew;
    }
}


