
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

export { executeQuery };