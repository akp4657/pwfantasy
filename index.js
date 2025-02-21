import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import cookieSession from 'cookie-session';
import * as user_service from './src_api/userService.js'
import * as game_service from './src_api/gameService.js';
import * as helper_service from './src_api/helper.js';
import mongo from './models/mongo.js';
import path from 'path';
import schedule from 'node-schedule';

// @ts-ignore
import cors from 'cors'
const app = express();
const port = 4000;
// Mounting the app under the process.env.ROUTE as a parent route (if present)
let route = process.env.ROUTE;
let parent_app;

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


//app.get("/", (req, res) => res.send("Express on Vercel"));
var notify_job = schedule.scheduleJob('0 * * * *', () => helper_service.getAccessToken()) //'15 12 * * 1-5'
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

export default app;