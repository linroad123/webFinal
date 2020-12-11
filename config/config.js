import {Pool} from "../deps.js";

let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
  config.database = Deno.env.get('TEST_ENVIRONMENT');
} else {
  config.database = {
    hostname: "hattie.db.elephantsql.com",
    database: "evkeetsx",
    user: "evkeetsx",
    password: "8f8lkt5p8sBwbXsLmEGI7IRkVOmtfupd",
    port: 5432
  };
  const CONCURRENT_CONNECTIONS = 3;
  config.connectionPool = new Pool({
  hostname: "hattie.db.elephantsql.com",
  database: "evkeetsx",
  user: "evkeetsx",
  password: "8f8lkt5p8sBwbXsLmEGI7IRkVOmtfupd",
  port: 5432 
  }, CONCURRENT_CONNECTIONS);
}

export { config}; 