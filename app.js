import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cookieSession from 'cookie-session';
import {google} from 'googleapis';
import * as user_service from './src_api/userService.js';
import * as game_service from './src_api/gameService.js';
import * as helper_service from './helper.js';
import path from 'path';
import mongo from './models/mongo.js';
import fs from 'fs';
import schedule from 'node-schedule';


import cors from 'cors'
const app = express();
const port = 4000;
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// Mounting the app under the process.env.ROUTE as a parent route (if present)
let route = process.env.ROUTE;
let parent_app;


// Mounting the app under the process.env.ROUTE as a parent route (if present)
// var route = process.env.ROUTE;
// var parent_app;
// /**
//  * Prints the names and majors of students in a sample spreadsheet:
//  * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
//  * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
//  */
// async function listMajors(auth) {
//   const sheets = google.sheets({version: 'v4', auth});
//   const res = await sheets.spreadsheets.values.get({
//     spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
//     range: 'Class Data!A2:E',
//   });
//   const rows = res.data.values;
//   if (!rows || rows.length === 0) {
//     console.log('No data found.');
//     return;
//   }
//   console.log('Name, Major:');
//   rows.forEach((row) => {
//     // Print columns A and E, which correspond to indices 0 and 4.
//     console.log(`${row[0]}, ${row[4]}`);
//   });
// }

// Enable CORS for all routes (dev)
app.use(cors());

mongo.connectToServer(function (err, client) {
  if (err) console.log(err)
});

// Configure cookie-session middleware
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'], // Replace with your secure keys
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


import http_server from 'http'
if(route == undefined) {
  http_server.createServer(app);
} else {
  parent_app = express();
  parent_app.use("/" + route, app);
  http_server.createServer(parent_app);
}

// body parser set up
app.use(bodyParser.urlencoded({ 
  limit: '200mb',
  extended: true
}));
app.use(bodyParser.json({
  limit: '200mb',
  extended: true
}));


// Endpoints for FE
app.post('/signup', user_service.signup);
app.post('/login', user_service.login);
app.post('/sheet', game_service.updatePoints);

app.get('/wrestler', game_service.getWrestler);
app.get('/wrestler/all', game_service.getWrestlers);
app.get('/team', game_service.getTeam);
app.get('/team/all', game_service.getAllTeams);
app.get('/authorize', helper_service.getAccessToken);
app.get('/user', user_service.getUser);

app.put('/draft', game_service.draftWrestler);
app.put('/drop', game_service.dropWrestler);
app.put('/team', game_service.editTeam);

var notify_job = schedule.scheduleJob('*/2 * * * *', () => helper_service.getAccessToken()) //'15 12 * * 1-5'
var notify_job = schedule.scheduleJob('*/5 * * * *', () => game_service.updatePoints()) 

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});