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
        $("li",".job-list").each((i, item) => {

                var jobId = $("a", item).attr("href").replace("/job_detail/", "").replace(".html", "").replace(/(^\s*)|(\s*$)/g, "");
                var red = $(".info-primary .name .red", item);
                var salary = red.text().replace(/(^\s*)|(\s*$)/g, "");
                red.remove();

                $(".info-company p",item).remove();

                var jobName = $(".info-primary .name", item).text().replace(/(^\s*)|(\s*$)/g, "");
                var companyId = null;
                var company = $(".info-company .name", item).text().replace(/(^\s*)|(\s*$)/g, "");
               
                var time = $(".time", item).text().replace(/(^\s*)|(\s*$)/g, "");

                var sp = $(".info-primary p",item).html().split('<em class="vline"></em>');
                var workYear = sp[1].replace(/(^\s*)|(\s*$)/g, "");;
                var education = sp[2].replace(/(^\s*)|(\s*$)/g, "");;
          

                    var job = new Job({
                        jobId: jobId,
                        job: jobName,
                        companyId: companyId,
                        company: company,
                        workYear: workYear,
                        education: education,
                        salary: salary,
                        addr: null,
                        time: time,
                        city: this.city,
                        kd: this.kd,
                        source: this.source
                    })
                    console.log(job);
                    arr.push(job);
                
            

        })
        return arr;

    }

    info($) {
        var content = $.html();
        var info = $(".detail-content .job-sec").first().text().replace(/(^\s*)|(\s*$)/g, "");
        var companyId = $(".info-company a").attr("href").replace("/gongsi/", "").replace(".html", "").replace(/(^\s*)|(\s*$)/g, "");

        return { info, content,companyId};
    }

    position($) {
 		var addr = $(".location-address").text().replace(/(^\s*)|(\s*$)/g, "");
        var map = $("#map-container").attr("data-long-lat");
        var position = null;  

        if(map.indexOf(",")>-1){
            var sp = map.split(",");
            position = gps.bd_encrypt(sp[1],sp[0]);
        }

 		
        //console.log({ addr, position })
        return ({ addr, position });
    }
}
