import mongoose from 'mongoose'

const wrestlerSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true,
    },
    Promotion: {
        type: String,
        required: true,
        trim: true,
    },
    Division: {
        type: String,
        trim: true,
    },
    Cost: {
        type: Number,
    },
    Show_Date: {
        type: Date,
        required: true,
    },
    Commentary: {
        type: Number,
        default: 0,
    },
    Return: {
        type: Number,
        default: 0,
    },
    Interferance: {
        type: Number,
        default: 0,
    },
    Social_Media: {
        type: Number,
        default: 0,
    },
    Kickout: {
        type: Number,
        default: 0,
    },
    DQ: {
        type: Number,
        default: 0,
    },
    Segment: {
        type: Number,
        default: 0,
    },
    Match: {
        type: Number,
        default: 0,
    },
    Finisher: {
        type: Number,
        default: 0,
    },
    Pin: {
        type: Number,
        default: 0,
    },
    Total: {
        type: Number,
        default: 0,
    },
    Turn: {
        type: Number,
        default: 0,
    },
    Gimmick_Change: {
        type: Number,
        default: 0,
    },
    Pinfall_Submission_KO: {
        type: Number,
        default: 0,
    },
    Crossover: {
        type: Number,
        default: 0,
    },
    Win: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

export default mongoose.model('Wrestler', wrestlerSchema, 'wrestlers')