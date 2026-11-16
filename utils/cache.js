const NodeCache = require('node-cache');
module.exports = new NodeCache({ stdTTL: 30, checkperiod: 60 });
