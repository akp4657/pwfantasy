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

// Mongoose DB
let models = {};
import _user from '../models/user.js';
models.user = _user;
import _wrestler from '../models/wrestler.js';
models.wrestler = _wrestler;

// TODO: Display the user's wrestlers in a table along with their points
// This will be default to the user's landing page, but linking through the leaderboard
// allows others to view that table

/**
 * Updates points from the Zoho sheet. This is a job that will run every 5-10 minutes
 * @param {*} req 
 * @param {*} res 
 * @returns 
 * @method POST
 */
export const updatePoints = async function() {
    try {
        let response = await axios.post(worksheet, new URLSearchParams({
            method: 'worksheet.records.fetch',
            worksheet_id: `${worksheet_id}#`
        }), {headers: zoho_headers})
    
        let filteredData = response.data.records.filter(row => row.Name && row.Name.trim() !== '')

        // Update the DB
        for(let row of filteredData) {
            try {
                await models.wrestler.findOneAndUpdate(
                    {Name: row.Name},
                    {
                        $set: {
                            Promotion: row.Promotion || '',
                            Show_Date: row['Show Date'] ? new Date(row['Show Date']) : null,
                            Commentary: row.Commentary || 0,
                            Cost: row.Cost,
                            Return: row.Return || 0,
                            Interferance: row.Interferance || 0,
                            Social_Media: row['Social Media'] || 0,
                            Kickout: row.Kickout || 0,
                            DQ: row.DQ || 0,
                            Segment: row.Segment || 0,
                            Match: row.Match || 0,
                            Finisher: row.Finisher || 0,
                            Pin: row.Pin || 0,
                            Total: row.Total || 0,
                            Division: row.Division || 0,
                            Turn: row.Turn || 0,
                            Gimmick_Change: row['Gimmick Change'] || 0,
                            Pinfall_Submission_KO: row['Pinfall/Submission/KO "Did they execute the win?"'] || 0,
                            Crossover: row.Crossover || 0,
                            Win: row.Win || 0
                        }
                    },
                    {upsert: true, new: true}
                )
            } catch(err) {
                console.log(err)
            }
        }

        await updateTeams();
    } catch(err) {
        console.log(err)
    }
}

/**
 * Helper function to update every team to correspond with the points update
 */
const updateTeams = async function() {
    try {
        const wrestlers = await models.wrestler.find({}).lean();
        
        // Create key-value pairs to search
        // Hashmap! I'd use a Hashmap!!!!!
        // https://www.youtube.com/watch?v=5bId3N7QZec
        const wrestlerMap = new Map(
            wrestlers.map(wrestler => [`${wrestler.Name}-${wrestler.Promotion}`, wrestler])
        );

        const users = await models.user.find({}, { _id: 1, Team: 1 });

        // Go through each user and create an update operation
        const bulkOps = users.map(({ _id, Team }) => ({
            updateOne: {
                filter: { _id },
                update: {
                    $set: {
                        Team: Team.map(wrestler => {
                            const key = `${wrestler.Name}-${wrestler.Promotion}`;
                            if (wrestlerMap.has(key)) {
                                return { ...wrestlerMap.get(key) };
                            }
                            return wrestler;
                        }),
                    },
                },
            },
        }));

        // Update all the users at once
        if (bulkOps.length) {
            await models.user.bulkWrite(bulkOps);
        }

        console.log("Teams updated");
    } catch (err) {
        console.error("Error updating teams:", err);
    }
}

/**
 * Get full wrestler details
 * @param {*} req 
 * @param {*} res 
 * @returns 
 * @method GET
 */
export const getWrestler = async function(req, res) {
    const wrestlerID = req.query.wrestler
    try {
        let wrestler = await models.wrestler.findOne({
            _id: wrestlerID
        })

        console.log(wrestler)
        return res.status(200).send({
            success: true,
            data: wrestler
        });
    } catch(err) {
        return res.status(500).send({
            data: err
        });
    }
}

/**
 * Get all wrestlers
 * @param {*} req 
 * @param {*} res 
 * @returns 
 * @method GET
 */
export const getWrestlers = async function(req, res) {
    try {
        let wrestle = await models.wrestler.find({})

        return res.status(200).send({
            success: true,
            data: wrestle
        });
    } catch(err) {
        return res.status(500).send({
            data: err
        });
    }
}

/**
 * Edit team, currently just for name
 * TODO: Add transactions (add/remove wrestlers)
 * TODO: Add a system for benching and active wrestlers
 * @param {*} req 
 * @param {*} res 
 * @returns 
 * @method PUT
 */
export const editTeam = async function(req, res) {
    const userID = req.body.user
    const teamName = req.body.team_name
    try {
        let user = await models.user.findOne({
            _id: userID
        })
        user.Team_Name = teamName;
        await user.save();
        return res.status(200).send({
            success: true,
            data: user
        });
    } catch(err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            error: err
        });
    }
}

/**
 * Draft wrestler to a user's team
 * @param {*} req 
 * @param {*} res 
 * @returns 
 * @method PUT
 */
export const draftWrestler = async function(req, res) {
    const userID = req.body.user;
    const wrestlerID = req.body.wrestler_id;

    let user = await models.user.findOne({_id: userID})
    let wrestler = await models.wrestler.findOne({_id: wrestlerID})

    if((user.Budget - wrestler.Cost) < 0) {
        return res.status(200).send({
            success: false,
            message: "Unable to draft wrestler." 
        });
    }

    try {
        user.Budget -= wrestler.Cost;
        user.Team.push(wrestler);
        await user.save();
        return res.status(200).send({
            success: true,
            data: user
        });
    } catch(err) {
        console.log(err)
        return res.status(400).send({
            success: false,
            error: err
        });
    }

}

/**
 * Get team for one user. Full breakdown of points
 * @param {*} req 
 * @param {*} res 
 * @returns 
 * @method GET
 */
export const getTeam = async function(req, res) {
    const userID = req.query.user;

    try {
        let user = await models.user.findOne({_id: userID});

        return res.status(200).send({
            success: true,
            data: {
                Team_Name: user.Team_Name,
                Team: user.Team
            }
        });
    } catch(err) {
        console.log(err);
        return res.status(400).send({
            success: false,
            error: err
        });
    }
}

/**
 * Display all teams
 * @param {*} req 
 * @param {*} res 
 * @returns 
 * @method GET
 */
export const getAllTeams = async function(req,res) {
    let users = await models.user.find()
    let allTeams = []

    try {
        for(let u of users) {
            let mappedTeam = u.Team.map(t => ({
                Name: t.Name,
                Promotion: t.Promotion,
                Show_Date: t.Show_Date,
                Total: t.Total
            }))
    
            let totalSum = u.Team.reduce((sum, t) => sum + t.Total, 0);

            allTeams.push({
                Owner: u.Username,
                Team_Name: u.Team_Name,
                Team: mappedTeam,
                Total: totalSum    
            })
        }

        // Sort descendingr
        allTeams.sort((a, b) => b.Total - a.Total);

        return res.status(200).send({
            success: true,
            data: allTeams
        });
    } catch(err) {
        console.log(err)
        return res.status(400).send({
            success: false,
            error: err
        });
    }
}