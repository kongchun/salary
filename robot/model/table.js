'use strict';

const TABLE_PAGE = "page";
const TABLE_JOB = "job";
const TABLE_COMPANY = "company";
const TABLE_REPERTORY_COMPANY = "repertory_company";
const TABLE_TECH = "tech";
const TABLE_BOARD = "board";
const TABLE_TOP = "top";
const TABLE_ADDRESS = "address";
const TABLE_ALIAS = "company_alias";
const TABLE_SALARY = "company_salary";


export default class Table{
    constructor({page=TABLE_PAGE,job=TABLE_JOB,company=TABLE_COMPANY,repertoryCompany=TABLE_REPERTORY_COMPANY,board=TABLE_BOARD,tech=TABLE_TECH,top=TABLE_TOP,address=TABLE_ADDRESS,company_alias=TABLE_ALIAS,company_salary=TABLE_SALARY}) {
    	this.page = page;
    	this.job = job;
    	this.company = company;
    	this.repertoryCompany = repertoryCompany;
    	this.board = board;
    	this.tech = tech;
		this.top = top;
		this.address =address;
		this.company_alias = company_alias;
		this.company_salary = company_salary;
    }	
}


