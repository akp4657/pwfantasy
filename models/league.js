import mongoose from 'mongoose'

const leagueSchema = new mongoose.Schema({
    Name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: /^[A-Za-z0-9_\-.\s]+$/,
    },
    Description: {
      type: String,
      trim: true,
      default: '',
    },
    Owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    /**
     * 1 - All Wrestlers (Default)
     * 2 - Randomized > increments of 15
     * 3 - WWE only
     * 4 - AEW only
     * 5 - Custom
     */
    PoolType: {
      type: Number,
      required: true,
      default: 1,
    },
    Pool: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wrestler'
    }],
    League_Members: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      team_name: {
        type: String,
        required: true,
        trim: true
      },
      join_date: {
        type: Date,
        default: Date.now
      },
      is_active: {
        type: Boolean,
        default: true
      }
    }],
    Max_Members: {
      type: Number,
      required: true,
      default: 10,
      min: 2,
      max: 20
    },
    /**
     * Draft configuration
     * Draft_Order: Array of user IDs in draft order
     * Current_Pick: Index of current pick in draft
     * Draft_Status: 'pending', 'active', 'completed'
     */
    Draft: {
      status: {
        type: String,
        enum: ['pending', 'active', 'completed'],
        default: 'pending'
      },
      order: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      current_pick: {
        type: Number,
        default: 0
      },
      picks: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        wrestler: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Wrestler'
        },
        pick_number: {
          type: Number,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }]
    },
    Draft_Day: {
      type: Date,
      required: true,
    },
    Draft_Time_Limit: {
      type: Number, // seconds per pick
      default: 60,
      min: 30,
      max: 300
    },
    Season_Start: {
      type: Date,
      required: true
    },
    Season_End: {
      type: Date
    },
    League_Type: {
      type: String,
      enum: ['public', 'private', 'invite_only'],
      default: 'public'
    },
    Invite_Code: {
      type: String,
      unique: true,
      sparse: true
    },
    Scoring_Rules: {
      win: { type: Number, default: 10 },
      loss: { type: Number, default: 0 },
      draw: { type: Number, default: 5 },
      title_defense: { type: Number, default: 5 },
      ppv_bonus: { type: Number, default: 3 }
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
}, { timestamps: true });

export default mongoose.model('League', leagueSchema, 'leagues')