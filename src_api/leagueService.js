import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios';
import * as config from '../config.js';
import * as bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb'


// TODO: Allow a user to create a league
// Modal for team creation/new model in Mongo

// TODO: Invite users to a leage (either via email or notification. Probably email)

// TODO: League specific drafting with a *shared* pool (this will take the most work)
// Timed draft page in real time at the start of Draft_Time. 

