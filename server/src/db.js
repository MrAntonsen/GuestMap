/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
const monk = require('monk');

const db = monk(process.env.DATABASE_URL);

module.exports = db;