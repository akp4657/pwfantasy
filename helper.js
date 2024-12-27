import dotenv from 'dotenv'
dotenv.config();
import axios from 'axios';

let slackToken;
let to = {};

const currentEnv = process.env.CURRENT || 'dev'

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

export const getAccessToken = async function() {
    try {
        const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
          params: {
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
          }
        });
    
        const accessToken = response.data;
        console.log('New Access Token:', accessToken);
        //return accessToken;
      } catch (error) {
        console.error('Error fetching new access token:', error.response ? error.response.data : error.message);
      }
}
