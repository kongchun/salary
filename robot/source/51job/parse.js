import Job from "../../model/job";
import loader from "../../../../iRobots/loader.js";

export default class Parse {
    constructor(city, kd) {
        this.city = city;
        this.kd = kd;
    }

    //根据返回的数据看是否自动停止解析
    maxPageSize(maxSize, html) {
        var $ = loader.parseHTML(html);
        var val = parseInt($(".dw_page .td").first().text().replace(/[^0-9.]/ig, ""));
        return val > maxSize ? maxSize : val;
    }

    list(html) {
        var $ = loader.parseHTML(html);
        var arr = [];
        $(".el", "#resultList").each((i, item) => {
            if ($(item).attr("class").indexOf("title") == -1) {

                var jobId = $(".t1 input", item).val();
                var jobName = $(".t1 a", item).text().replace(/(^\s*)|(\s*$)/g, "");
                var companyId = $(".t2 a", item).attr("href").replace("http://jobs.51job.com/all/", "").replace(".html", "").replace(/(^\s*)|(\s*$)/g, "");
                var company = $(".t2 a", item).text().replace(/(^\s*)|(\s*$)/g, "");
                var salary = $(".t4", item).text().replace(/(^\s*)|(\s*$)/g, "");
                var time = $(".t5", item).text().replace(/(^\s*)|(\s*$)/g, "");

                var city = $(".t3", item).text().replace(/(^\s*)|(\s*$)/g, "");
                
                if (city != "异地招聘") {

                    var job = new Job({
                        jobId: jobId,
                        job: jobName,
                        companyId: companyId,
                        company: company,
                        salary: salary,
                        time: time,
                        pageContent:$(item).html(),
                        city: this.city,
                        kd: this.kd,
                        source: "51job"
                    })

                    arr.push(job);
                }
            }

        })
        return arr;

    }

    info(html) {
        var $ = loader.parseHTML(html);
        var ltype = $(".msg.ltype").text().replace(/(^\s*)|(\s*$)/g, "").split("|");
        var workYear = ltype[1].replace(/&nbsp;/ig,"");
        if (workYear.indexOf("招")>-1){
            workYear="不限"
        }

        var education =ltype[2].replace(/&nbsp;/ig,"");
        if (education.indexOf("招")>-1){
            education="不限"
        }
    
        if (education.indexOf("发布")>-1){
            education="不限"
        }
        var info = $(".bmsg.job_msg.inbox").text().replace(/(^\s*)|(\s*$)/g, "");
        var addr = $(".i_map").parent().text().replace("上班地址：","").replace("地图","").replace(/(^\s*)|(\s*$)/g, "");
        var companyDetail = $(".tmsg.inbox").html().replace(/<br>/g,"\\n");
        var img = $(".com_name.himg img").attr("src");
		var companyLogo = (!img)?null:img;
        return { info, workYear,education, addr,companyDetail,companyLogo};
    
    }
}
