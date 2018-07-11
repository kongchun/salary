'use strict';

const TABLE_PAGE = "page";
const TABLE_JOB = "job";
const TABLE_COMPANY = "company";
const TABLE_REPERTORY_COMPANY = "repertory_company";
const TABLE_TECH = "tech";
const TABLE_BOARD = "board";
const TABLE_TOP = "top";


export default class Table{
    constructor({page=TABLE_PAGE,job=TABLE_JOB,company=TABLE_COMPANY,repertoryCompany=TABLE_REPERTORY_COMPANY,board=TABLE_BOARD,tech=TABLE_TECH,top=TABLE_TOP}) {
    	this.page = page;
    	this.job = job;
    	this.company = company;
    	this.repertoryCompany = repertoryCompany;
    	this.board = board;
    	this.tech = tech;
		this.top = top;
    }	
}


