import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios';
import * as config from '../config.js';
import * as bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

const worksheet = process.env.WORKSHEET_URL
const worksheet_id = process.env.WORKSHEET_ID
const zoho_headers = {
    'Authorization': `Zoho-oauthtoken ${process.env.ACCESS_TOKEN}`,
    'Content-Type': 'application/x-www-form-urlencoded',
};

// TODO: Display the user's wrestlers in a table along with their points
// This will be default to the user's landing page, but linking through the leaderboard
// allows others to view that table

// Retrieve Google Sheet Data (This will be a job)
// TODO: Show and update users based on the Google Sheet
export const updatePoints = async function(req, res) {
    try {
        let response = await axios.post(worksheet, new URLSearchParams({
            method: 'worksheet.records.fetch',
            worksheet_id: worksheet_id
        }), {headers: zoho_headers})
    
        console.log(response.data)
    
        return res.status(200).send({
            data: response.data
        });
    } catch(err) {
        console.log(err)
        return res.status(500).send({
            data: err
        });
    }
}
// TODO: Show all of the user's teams in a leaderboard style