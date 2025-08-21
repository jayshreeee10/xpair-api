const { Pool, types } = require("pg");
require("dotenv").config();

// Add this to properly handle JSON/JSONB types
types.setTypeParser(types.builtins.JSON, val => val);
types.setTypeParser(types.builtins.JSONB, val => val);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.on("connect", () => {
    console.log("connected to database");
});

module.exports = pool;