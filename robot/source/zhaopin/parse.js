import Job from "../../model/job";
import loader from "../../../../iRobots/loader.js";

export default class Parse {
    constructor(city, kd, source) {
        this.city = city;
        this.kd = kd;
        this.source = source;
    }

    //根据返回的数据看是否自动停止解析
    maxPageSize(maxSize, html) {
       // var $ = loader.parseHTML(html);
        var val = 20;
        return val > maxSize ? maxSize : val;
    }

    list(html) {
   
        var $ = loader.parseHTML(html);
        var arr = [];
        //console.log( $(".job-list").html())
        $(".contentpile__content__wrapper__item").each((i, item) => {
                
                var jobId = $("a",item).attr("zp-stat-jdno");
                var jobName = $(".contentpile__content__wrapper__item__info__box__jobname__title", item).text().replace(/(^\s*)|(\s*$)/g, "");
                var companyId = $(".company_title", item).attr("href").split(".htm")[0].replace("https://company.zhaopin.com/","").replace(/(^\s*)|(\s*$)/g, "");
                var company = $(".company_title", item).text().replace(/(^\s*)|(\s*$)/g, "");
                var salary = $(".contentpile__content__wrapper__item__info__box__job__saray", item).text().replace(/(^\s*)|(\s*$)/g, "");
                //var time = $(".time", item).text().replace(/(^\s*)|(\s*$)/g, "");
                var sp = $(".contentpile__content__wrapper__item__info__box__job__demand__item",item);
                var workYear = $(sp[1]).text().replace(/(^\s*)|(\s*$)/g, "");
                var education = $(sp[2]).text().replace(/(^\s*)|(\s*$)/g, "");
          

                    var job = new Job({
                        jobId: jobId,
                        job: jobName,
                        companyId: companyId,
                        company: company,
                        workYear: workYear,
                        education: education,
                        salary: salary,
                        addr: null,
                        time: null,
                        pageContent:$(item).html(),
                        city: this.city,
                        kd: this.kd,
                        source: this.source
                    })

                    //console.log(job)

                    arr.push(job);
                
        })
        return arr;

    }

    info(html) {
        var $ = loader.parseHTML(html);
        var info = $(".describtion__detail-content").text().replace(/(^\s*)|(\s*$)/g, "");
        var companyDetail = $(".company__description").text().replace(/(^\s*)|(\s*$)/g, "");
       //var workYear =$(".exp").text().replace(/(^\s*)|(\s*$)/g, "");
        //var education =$(".exp").next().text().replace(/(^\s*)|(\s*$)/g, "");
        var time = $(".summary-plane__time").text().replace(/(^\s*)|(\s*$)/g, "");
        var addr = $(".job-address__content-text").text().replace(/(^\s*)|(\s*$)/g, "");
        var img = $(".companyLogo").attr("src");
        var companyLogo = (!img)?null:img;
      
        if(addr.indexOf("不限")>-1){
            addr = ""
        }
 		var position = null; 	
        return { info,addr,position,companyLogo,time,companyDetail};
    }

    
}


