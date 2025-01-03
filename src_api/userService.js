import dotenv from 'dotenv'
dotenv.config()
import * as config from '../config.js';
import * as bcrypt from 'bcrypt-nodejs';
import queryString from 'query-string';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb'
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';
import path from 'path'
import axios from 'axios'

// Mongoose DB
let models = {};
import _user from '../models/user.js'
models.user = _user
// import _characters from '../models/characters.js'
// models.characters = _characters
// import _video from '../models/video.js'
// models.video = _video

// Sign up call
export const signup = async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    //const email = req.body.email;

    // Check if the username isn't taken
    let user = await models.user.findOne({Username: username})

    if(user) return res.status(201).send({message: 'Username exists'})
    
    try {
        //hash password
        const salt = bcrypt.genSaltSync(config.pwd_salt_rounds);
        var hash = bcrypt.hashSync(password, salt);

        //create user
        let new_user = new models.user({
            Username: username,
            Password: hash,
            Budget: 500,
            Salt: salt,
            Team_Name: '',
            Team: [],
            Email_List: false,
        });
        await new_user.save();
        return res.status(200).send({
            user: new_user
        });
    } catch(err) {
        console.log(err)
        return res.status(500).send({
            message: "Contact Admin"
        });
    }
}

export const login = async function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (username && password) {
        let user = await models.user.findOne({Username: username})
        if(user) {
            try {
                let dcrypt = bcrypt.compareSync(password, user.Password);
                console.log(dcrypt)
                if (!dcrypt) {
                    return res.status(401).send({
                        success: false,
                        message: "Unauthorized 1"
                    });
                }
                else {
                    return res.status(200).send({
                        success: true,
                        User: user
                    });
                }
            } catch(err) {
                console.log(err)
                return res.status(400).send({
                    success: false,
                    message: err
                });
            }
        } else {
            return res.status(200).send({
                success: false,
                message: 'Incorrect Username/Password'
            });
        }
    }
    else {
        return res.status(400).send({
            success: false,
            message: "Insufficient parameters"
        });
    }
}

/**
 * Get full user details
 * @param {*} req 
 * @param {*} res 
 * @returns 
 * @method GET
 */
export const getUser = async function(req, res) {
    const userID = req.query.user_id
    try {
        let user = await models.user.findOne({
            _id: userID
        })

        return res.status(200).send({
            success: true,
            data: user
        });
    } catch(err) {
        return res.status(500).send({
            data: err
        });
    }
}


// TODO: Prompt login when coming to the page
// TODO: Add logout, password reset, and get calls for user