import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    Name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: /^[A-Za-z0-9_\-.]/,
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
    },
    Pool: [{}], // Just house _ids here
    League_Members: [{}], // House _ids here as well
    League_Members: [{}], // House _ids here as well

    /**
     * User _id
     * Draft Order
     * On The Clock - Disable drafting for users not on the clock on their respective {...}/league/[Name]/draft pages
     */
    Draft: [{}],
    Draft_Day: {
      type: Date,
      required: true,
    },
    Season_Start: {
      type: Date,
      required: true
    },
    Season_End: {
      type: Date
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
}, { timestamps: true });

export default mongoose.model('User', userSchema, 'users')