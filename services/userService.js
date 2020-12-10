import { executeQuery } from "../database/database.js";
import {bcrypt} from "../deps.js";

const setRegister = async(email) =>{
    const existingUsers = await executeQuery("SELECT * FROM users WHERE email = $1", email);
    return existingUsers;
}

const password = async(email,password) => {
    const hash = await bcrypt.hash(password);
    await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
}

export { setRegister,password };