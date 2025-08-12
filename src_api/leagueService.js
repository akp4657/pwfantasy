import dotenv from 'dotenv'
dotenv.config()
import League from '../models/league.js';

// League creation and management
export const createLeague = async (req, res) => {
    try {
        const { name, description, poolType, maxMembers, draftDay, seasonStart, seasonEnd, leagueType, ownerId } = req.body;
        
        if (!ownerId) {
            return res.status(400).json({ error: 'Owner ID is required' });
        }

        // Check if user already owns a league
        const existingLeague = await League.findOne({ Owner: ownerId });
        if (existingLeague) {
            return res.status(400).json({ error: 'User already owns a league' });
        }

        // Generate invite code for private leagues
        let inviteCode = null;
        if (leagueType === 'private' || leagueType === 'invite_only') {
            inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        }

        const league = new League({
            Name: name,
            Description: description || '',
            Owner: ownerId,
            PoolType: poolType || 1,
            Max_Members: maxMembers || 10,
            Draft_Day: draftDay,
            Season_Start: seasonStart,
            Season_End: seasonEnd,
            League_Type: leagueType || 'public',
            Invite_Code: inviteCode,
            League_Members: [{
                user: ownerId,
                team_name: `${name} Owner`,
                join_date: new Date(),
                is_active: true
            }]
        });

        await league.save();
        res.status(201).json({ success: true, league, inviteCode });
    } catch (error) {
        console.error('Error creating league:', error);
        res.status(500).json({ error: 'Failed to create league' });
    }
};

// Get all public leagues
export const getPublicLeagues = async (req, res) => {
    try {
        const leagues = await League.find({ League_Type: 'public' })
            .populate('Owner', 'Name')
            .populate('League_Members.user', 'Name')
            .select('-Invite_Code -Pool')
            .sort({ createdDate: -1 });
        
        res.json(leagues);
    } catch (error) {
        console.error('Error fetching public leagues:', error);
        res.status(500).json({ error: 'Failed to fetch leagues' });
    }
};

// Get user's leagues (owned or member of)
export const getUserLeagues = async (req, res) => {
    try {
        const userId = req.query.userId || req.body.userId;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        
        const leagues = await League.find({
            $or: [
                { Owner: userId },
                { 'League_Members.user': userId }
            ]
        })
        .populate('Owner', 'Name')
        .populate('League_Members.user', 'Name')
        .populate('Pool', 'Name Brand Image')
        .sort({ createdDate: -1 });

        res.json(leagues);
    } catch (error) {
        console.error('Error fetching user leagues:', error);
        res.status(500).json({ error: 'Failed to fetch user leagues' });
    }
};

// Get specific league details
export const getLeague = async (req, res) => {
    try {
        const { leagueId } = req.params;
        
        const league = await League.findById(leagueId)
            .populate('Owner', 'Name')
            .populate('League_Members.user', 'Name')
            .populate('Pool', 'Name Brand Image Stats')
            .populate('Draft.picks.wrestler', 'Name Brand Image');

        if (!league) {
            return res.status(404).json({ error: 'League not found' });
        }

        res.json(league);
    } catch (error) {
        console.error('Error fetching league:', error);
        res.status(500).json({ error: 'Failed to fetch league' });
    }
};

// Join league
export const joinLeague = async (req, res) => {
    try {
        const { leagueId } = req.params;
        const { teamName, inviteCode, userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const league = await League.findById(leagueId);
        if (!league) {
            return res.status(404).json({ error: 'League not found' });
        }

        // Check if user is already a member
        const isMember = league.League_Members.some(member => 
            member.user.toString() === userId.toString()
        );
        if (isMember) {
            return res.status(400).json({ error: 'Already a member of this league' });
        }

        // Check league capacity
        if (league.League_Members.length >= league.Max_Members) {
            return res.status(400).json({ error: 'League is full' });
        }

        // Check invite code for private leagues
        if (league.League_Type === 'private' || league.League_Type === 'invite_only') {
            if (!inviteCode || inviteCode !== league.Invite_Code) {
                return res.status(400).json({ error: 'Invalid invite code' });
            }
        }

        // Add user to league
        league.League_Members.push({
            user: userId,
            team_name: teamName,
            join_date: new Date(),
            is_active: true
        });

        await league.save();
        res.json({ success: true, message: 'Successfully joined league' });
    } catch (error) {
        console.error('Error joining league:', error);
        res.status(500).json({ error: 'Failed to join league' });
    }
};

// Leave league
export const leaveLeague = async (req, res) => {
    try {
        const { leagueId } = req.params;
        const userId = req.body.userId || req.query.userId;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const league = await League.findById(leagueId);
        if (!league) {
            return res.status(404).json({ error: 'League not found' });
        }

        // Check if user is the owner
        if (league.Owner.toString() === userId.toString()) {
            return res.status(400).json({ error: 'League owner cannot leave. Transfer ownership or delete league.' });
        }

        // Remove user from league
        league.League_Members = league.League_Members.filter(member => 
            member.user.toString() !== userId.toString()
        );

        await league.save();
        res.json({ success: true, message: 'Successfully left league' });
    } catch (error) {
        console.error('Error leaving league:', error);
        res.status(500).json({ error: 'Failed to leave league' });
    }
};

// Start draft
export const startDraft = async (req, res) => {
    try {
        const { leagueId } = req.params;
        const userId = req.body.userId || req.query.userId;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const league = await League.findById(leagueId);
        if (!league) {
            return res.status(404).json({ error: 'League not found' });
        }

        // Check if user is owner
        if (league.Owner.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Only league owner can start draft' });
        }

        // Check if draft can start
        if (league.Draft.status !== 'pending') {
            return res.status(400).json({ error: 'Draft has already started or completed' });
        }

        if (league.League_Members.length < 2) {
            return res.status(400).json({ error: 'Need at least 2 members to start draft' });
        }

        // Randomize draft order
        const memberIds = league.League_Members.map(member => member.user);
        const shuffledOrder = memberIds.sort(() => Math.random() - 0.5);

        league.Draft.status = 'active';
        league.Draft.order = shuffledOrder;
        league.Draft.current_pick = 0;

        await league.save();
        res.json({ success: true, draftOrder: shuffledOrder });
    } catch (error) {
        console.error('Error starting draft:', error);
        res.status(500).json({ error: 'Failed to start draft' });
    }
};

// Make draft pick
export const makeDraftPick = async (req, res) => {
    try {
        const { leagueId } = req.params;
        const { wrestlerId, userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const league = await League.findById(leagueId);
        if (!league) {
            return res.status(404).json({ error: 'League not found' });
        }

        // Check if draft is active
        if (league.Draft.status !== 'active') {
            return res.status(400).json({ error: 'Draft is not active' });
        }

        // Check if it's user's turn
        const currentUser = league.Draft.order[league.Draft.current_pick];
        if (currentUser.toString() !== userId.toString()) {
            return res.status(400).json({ error: 'Not your turn to draft' });
        }

        // Check if wrestler is available
        const isAvailable = league.Pool.some(wrestler => 
            wrestler.toString() === wrestlerId
        );
        if (!isAvailable) {
            return res.status(400).json({ error: 'Wrestler not available in pool' });
        }

        // Check if wrestler already drafted
        const alreadyDrafted = league.Draft.picks.some(pick => 
            pick.wrestler.toString() === wrestlerId
        );
        if (alreadyDrafted) {
            return res.status(400).json({ error: 'Wrestler already drafted' });
        }

        // Make the pick
        const pickNumber = league.Draft.picks.length + 1;
        league.Draft.picks.push({
            user: userId,
            wrestler: wrestlerId,
            pick_number: pickNumber,
            timestamp: new Date()
        });

        // Remove wrestler from pool
        league.Pool = league.Pool.filter(wrestler => 
            wrestler.toString() !== wrestlerId
        );

        // Move to next pick
        league.Draft.current_pick = (league.Draft.current_pick + 1) % league.Draft.order.length;

        // Check if draft is complete
        if (league.Draft.picks.length >= league.League_Members.length * 15) { // Assuming 15 wrestlers per team
            league.Draft.status = 'completed';
        }

        await league.save();
        res.json({ success: true, pickNumber, nextPick: league.Draft.current_pick });
    } catch (error) {
        console.error('Error making draft pick:', error);
        res.status(500).json({ error: 'Failed to make draft pick' });
    }
};

// Get draft status
export const getDraftStatus = async (req, res) => {
    try {
        const { leagueId } = req.params;
        
        const league = await League.findById(leagueId)
            .populate('Draft.order', 'Name')
            .populate('Draft.picks.user', 'Name')
            .populate('Draft.picks.wrestler', 'Name Brand Image');

        if (!league) {
            return res.status(404).json({ error: 'League not found' });
        }

        res.json({
            status: league.Draft.status,
            currentPick: league.Draft.current_pick,
            order: league.Draft.order,
            picks: league.Draft.picks,
            poolSize: league.Pool.length
        });
    } catch (error) {
        console.error('Error fetching draft status:', error);
        res.status(500).json({ error: 'Failed to fetch draft status' });
    }
};

// Update league settings (owner only)
export const updateLeague = async (req, res) => {
    try {
        const { leagueId } = req.params;
        const updates = req.body;
        const userId = req.body.userId || req.query.userId;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const league = await League.findById(leagueId);
        if (!league) {
            return res.status(404).json({ error: 'League not found' });
        }

        // Check if user is owner
        if (league.Owner.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Only league owner can update settings' });
        }

        // Update allowed fields
        const allowedUpdates = ['Description', 'Max_Members', 'Draft_Time_Limit', 'Scoring_Rules'];
        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) {
                league[field] = updates[field];
            }
        });

        await league.save();
        res.json({ success: true, league });
    } catch (error) {
        console.error('Error updating league:', error);
        res.status(500).json({ error: 'Failed to update league' });
    }
};

// Delete league (owner only)
export const deleteLeague = async (req, res) => {
    try {
        const { leagueId } = req.params;
        const userId = req.body.userId || req.query.userId;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const league = await League.findById(leagueId);
        if (!league) {
            return res.status(404).json({ error: 'League not found' });
        }

        // Check if user is owner
        if (league.Owner.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Only league owner can delete league' });
        }

        await League.findByIdAndDelete(leagueId);
        res.json({ success: true, message: 'League deleted successfully' });
    } catch (error) {
        console.error('Error deleting league:', error);
        res.status(500).json({ error: 'Failed to delete league' });
    }
}; 

