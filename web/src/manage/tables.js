$(function () {
    getCompanyDetail($('.table-salary-logo'), $('.table-salary-score'));
});

function getCompanyDetail(logos, scores, stop = false) {
    let companies = '';
    for (let logoImg of logos) {
        companies += logoImg.getAttribute('alias') + ',';
    }
    let param = companies.substring(0, companies.length - 1);
    $.post('/api/getCompanyLogoAndScore', { data: param }, function (data) {
        try {
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    if (!item) {
                        return;
                    }
                    if (item.logo) {
                        logos[i].src = item.logo;
                    }
                    if (item.score) {
                        scores[i].innerHTML = item.score;
                    }
                }

            }
        } catch (e) {
            console.log(e);
        } finally {
            console.log(stop);
            if (!stop) {
                console.log(111);
                getCompanyDetail($('.table-number-logo'), $('.table-number-score'), true);
            }
        }

    });
}