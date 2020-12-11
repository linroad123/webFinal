
import { Client } from "../deps.js";
import { config } from "../config/config.js";

const getClient = () => {
  return new Client(config.database);
}

const executeQuery = async(query, ...params) => {
  const client = await config.connectionPool.connect();
  try {
      return await client.query(query, ...params);
  } catch (e) {
      console.log(e);  
  } finally {
      client.release();
  }
  
  return null;
};

const executeCachedQuery = async(query, ...params) => {
  const key = query + params.reduce((acc, o) => acc + "-" + o, "");
  if (cache[key]) {
      return cache[key];
  }

  const res = await executeQuery(query, ...params);
  cache[key] = res;

  return res;
}

export { executeQuery,executeCachedQuery };