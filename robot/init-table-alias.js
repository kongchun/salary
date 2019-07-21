const Database = require('../../iRobots/db.js');

let db = Database('127.0.0.1', 'kongchun');

run();

async function run() {
    try {
        await db.open('repertory_company');
        let data = await db.findToArray({ sync: { $ne: true } }, { company: 1, companyAlias: 1 });
        if (data && data instanceof Array) {
            console.log(`total count: ${data.length}`);
            if (data.length > 0) {
                let collection = await db.open('company_alias');
                let bulk = collection.initializeUnorderedBulkOp();
                for (let aliasObj of data) {
                    bulk.insert(aliasObj);
                }
                let ret = await bulk.execute();
                console.log(`inserted: ${ret.nInserted}`);
                collection = await db.open('repertory_company');
                await collection.update({ sync: { $ne: true } }, { $set: { sync: true } }, { multi: true });
            }
        }
    } catch (e) {
        console.error(e);
    }
    db.close();
}
