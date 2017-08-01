import gps from "../../../../iRobots/gps.js";
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
        var $ = loader.parseHTML(html);
        var val = 20;
        return val > maxSize ? maxSize : val;
    }

    list(html) {
   
        var $ = loader.parseHTML(html);
        var arr = [];
        console.log( $(".job-list").html())
        $(".job-list").each((i, item) => {
                
                var jobId = $(item).attr("data-number");
                var jobName = $(".job-name", item).text().replace(/(^\s*)|(\s*$)/g, "");
                var companyId = jobId.split("j")[0];
                var company = $(".comp-name", item).text().replace(/(^\s*)|(\s*$)/g, "");
                var salary = $(".job-sal", item).text().replace(/(^\s*)|(\s*$)/g, "");
                var time = $(".time", item).text().replace(/(^\s*)|(\s*$)/g, "");
          

                    var job = new Job({
                        jobId: jobId,
                        job: jobName,
                        companyId: companyId,
                        company: company,
                        workYear: null,
                        education: null,
                        salary: salary,
                        addr: null,
                        time: time,
                        city: this.city,
                        kd: this.kd,
                        source: this.source
                    })

                    //console.log(job)

                    arr.push(job);
                
        })
        return arr;

    }

    info($) {
        var content = $.html();
        var info = $("article").text().replace(/(^\s*)|(\s*$)/g, "");
        var t = $(".exp").text().replace(/(^\s*)|(\s*$)/g, "");
        var workYear =$(".exp").text().replace(/(^\s*)|(\s*$)/g, "");
        var education =$(".exp").next().text().replace(/(^\s*)|(\s*$)/g, "");

        return { info, content, workYear,education};
    }

    position($) {
 		var addr = $(".add").text().replace(/(^\s*)|(\s*$)/g, "");
        if(addr.indexOf("不限")>-1){
            addr = ""
        }
 		var position = null; 	
        return ({ addr, position });
    }
}


