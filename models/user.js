import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    Username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: /^[A-Za-z0-9_\-.]{1,16}$/,
    },
    Salt: {
      type: Buffer,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Team_Name: {
      type: String,
      trim: true,
      match: /^[A-Za-z0-9_\-.]{1,16}$/,
    },
    Team: [{}],
    Email_List: {
      type: Boolean,
      default: false
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
}, { timestamps: true });

export default mongoose.model('User', userSchema, 'users')