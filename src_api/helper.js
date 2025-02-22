import dotenv from 'dotenv'
dotenv.config();
import axios from 'axios';
import fs from 'fs';

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
    
        const accessToken = response.data.access_token;

        await updateRenderEnv(process.env.RENDER_SERVICE_ID, accessToken)

        // Reload process.env
        //await dotenv.config();
        process.env.ACCESS_TOKEN = accessToken;

        //return accessToken;
      } catch (error) {
        console.error('Error fetching new access token:', error.response ? error.response.data : error.message);
      }
}

async function updateRenderEnv(serviceId, accessToken) {
  try {

    let obj = JSON.stringify({
      value: accessToken,
    })
    const response = await axios.put(
      `https://api.render.com/v1/services/${serviceId}/env-vars/ACCESS_TOKEN`, obj,
      {
        headers: {
          'Authorization': `Bearer ${process.env.RENDER_API_KEY}`,
        },
      }
    );
    console.log('Updated environment variable:', response.data);
  } catch (error) {
    console.error('Error updating environment variable:', error.response ? error.response.data : error.message);
  }
}

