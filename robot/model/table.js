'use strict';

const TABLE_PAGE = "page";
const TABLE_JOB = "job";
const TABLE_COMPANY = "company";
const TABLE_REPERTORY_COMPANY = "repertory_company";
const TABLE_YEAR ="year";
const TABLE_TECH = "tech";

export default class Table{
    constructor({page=TABLE_PAGE,job=TABLE_JOB,company=TABLE_COMPANY,repertoryCompany=TABLE_REPERTORY_COMPANY,year=TABLE_YEAR,tech=TABLE_TECH}) {
    	this.page = page;
    	this.job = job;
    	this.company = company;
    	this.repertoryCompany = repertoryCompany;
    	this.year = year;
    	this.tech = tech;
    }	
}


