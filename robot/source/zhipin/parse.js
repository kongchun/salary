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

                var jobId = $(".info-primary .primary-box", item).attr("data-jid").replace(/(^\s*)|(\s*$)/g, "");
                var salary = $(".info-primary .red", item).text().replace(/(^\s*)|(\s*$)/g, "");
            

                var jobName = $(".job-name", item).text().replace(/(^\s*)|(\s*$)/g, "");
                var companyId = $(".info-company a", item).attr("href").replace("/gongsi/", "").replace(".html", "").replace(/(^\s*)|(\s*$)/g, "");
                var company = $(".info-company a", item).text().replace(/(^\s*)|(\s*$)/g, "");

                var sp = $(".info-primary .job-limit p",item).html().split('<em class="vline"></em>');

                var workYear = sp[0].replace(/(^\s*)|(\s*$)/g, "");;
                var education = sp[1].replace(/(^\s*)|(\s*$)/g, "");;
          
                    var job = new Job({
                        jobId: jobId,
                        job: jobName,
                        companyId: companyId,
                        company: company,
                        companyAlias:company,
                        workYear: workYear,
                        education: education,
                        salary: salary,
                        time: null,
                        pageContent:$(item).html(),
                        city: this.city,
                        kd: this.kd,
                        source: this.source
                    })
                    //console.log(job);
                    arr.push(job);

        })
        return arr;

    }

    info(html) {
        var $ = loader.parseHTML(html);
        var info = $(".detail-content .job-sec").first().text().replace(/(^\s*)|(\s*$)/g, "");

        var company = $("[ka=job-detail-company_custompage]").text().replace(/(^\s*)|(\s*$)/g, "");
        var addr = $(".location-address").text().replace(/(^\s*)|(\s*$)/g, "");

        var companyDetail = $(".job-sec.company-info .text").text().replace(/(^\s*)|(\s*$)/g, "");
        var img = $("a[ka='job-detail-company-logo_custompage'] img").attr("src");
        var companyLogo = (!img)?null:img;

        var position= null;
        try{
        var map = $(".job-location-map img").attr("src");
            var t = map.split("A:")[1].split("&amp;key=")[0];
            var lat =  t.split(",")[1];
		    var lng =   t.split(",")[0];
            position = {lat,lng};   
        }catch(e){}  
       
        
        return { info ,addr, position,company,companyLogo,companyDetail,position};
    }

}


