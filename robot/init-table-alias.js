const Database = require('../../iRobots/db.js');
const aliasSync = require('./utils/aliasSync');

let db = Database('127.0.0.1', 'kongchun');

aliasSync(db);
