import * as dotenv from 'dotenv';
dotenv.config();
// @ts-ignore
import express from 'express';
// @ts-ignore
import bodyParser from 'body-parser';
// @ts-ignore
import passport from 'passport';
// @ts-ignore
import cookieSession from 'cookie-session';
// @ts-ignore
import * as user_service from './userService.js';
// @ts-ignore
import * as game_service from './gameService.js';
// @ts-ignore
import * as helper_service from './helper.js';
// @ts-ignore
import mongo from '../models/mongo.js';
//import schedule from 'node-schedule';

// @ts-ignore
import cors from 'cors'
const app = express();
const port = 4000;
// Mounting the app under the process.env.ROUTE as a parent route (if present)
let route = process.env.ROUTE;
let parent_app;

// Enable CORS for all routes (dev)
app.use(cors());

mongo.connectToServer(function (err: any, client: any) {
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
app.post('/api/signup', user_service.signup);
app.post('/api/login', user_service.login);
app.post('/api/sheet', game_service.updatePoints);

app.get('/api/wrestler', game_service.getWrestler);
app.get('/api/wrestler/all', game_service.getWrestlers);
app.get('/api/team', game_service.getTeam);
app.get('/api/team/all', game_service.getAllTeams);
app.get('/api/authorize', helper_service.getAccessToken);
app.get('/api/user', user_service.getUser);

app.put('/api/draft', game_service.draftWrestler);
app.put('/api/drop', game_service.dropWrestler);
app.put('/api/team', game_service.editTeam);


app.get("/", (req: any, res: any) => res.send("Express on Vercel"));

//var notify_job = schedule.scheduleJob('*/2 * * * *', () => helper_service.getAccessToken()) //'15 12 * * 1-5'
//var notify_job = schedule.scheduleJob('*/5 * * * *', () => game_service.updatePoints()) 

// Optional fallthrough error handler
app.use(function onError(err: any, req: any, res: any, next: any) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});