import dotenv from 'dotenv'
dotenv.config()

let slackToken;
let to = {};

const currentEnv = process.env.CURRENT || 'dev'

export const db_config = {
    connection_string: process.env.MONGO_CONNECTION
}

export const jwt_key = process.env.JWT_KEY;
export const email_key = process.env.EMAIL_KEY;
export const pwd_salt_rounds = Number(process.env.PWD_SALT);
