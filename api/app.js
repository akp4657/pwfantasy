import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import cookieSession from 'cookie-session';
import * as user_service from '../src_api/userService.js';
import * as game_service from '../src_api/gameService.js';
import * as helper_service from '../src_api/helper.js';
import mongo from '../models/mongo.js';
import cors from 'cors';

const app = express();

// Enable CORS for all routes (dev)
app.use(cors());

// Connect to MongoDB
mongo.connectToServer(function (err, client) {
  if (err) console.log(err);
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

// Body parser setup
app.use(
  bodyParser.urlencoded({
    limit: '200mb',
    extended: true,
  })
);
app.use(
  bodyParser.json({
    limit: '200mb',
    extended: true,
  })
);

// Define routes for the API
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

// Export the Express app as a handler function for Vercel
export default (req, res) => {
  app(req, res); // This passes requests to Express
};
