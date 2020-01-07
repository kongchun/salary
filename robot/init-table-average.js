const Database = require('../../iRobots/db.js');

let db = Database('127.0.0.1', 'kongchun');

main();

async function main() {
    try {
        await db.open('top');
        let data = await db.findToArray({}, { companyRank: 1, year: 1, month: 1 });
        if (data instanceof Array && data.length > 0) {
            console.log(`total count: ${data.length}`);
            let collection = await db.open('company_salary');
            let bulk = collection.initializeUnorderedBulkOp();
            for (let rankObj of data) {
                let companies = rankObj.companyRank;
                let year = parseInt(rankObj.year);
                let month = parseInt(rankObj.month);
                if (companies instanceof Array && companies.length > 0) {
                    for (let companyObj of companies) {
                        let salary = companyObj.salary || companyObj.average;
                        bulk.insert({
                            company: companyObj.company,
                            average: salary,
                            year: year,
                            month: month
                        });
                    }
                }
            }
            let ret = await bulk.execute();
            console.log(`inserted: ${ret.nInserted}`);
        }
    } catch (e) {
        console.error(e);
    }
    db.close();
}
