import mongoose from "mongoose";
import { increment } from '../helpers/increment.js';
const { Schema, model } = mongoose;

const Ask = new Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    answers: [String],
    is_correct: { type: Number, required: true },
}, { _id: false });

const Quiz = new Schema({
    _id: Number,
    name: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    level: { type: Number, ref: 'Level', required: true },
    points: { type: Number, required: true },
    owner: { type: Number, ref: 'User' },
    asks: [Ask],
    result_users: [{ type: Number, ref: 'ResultGame' }],
    xp: { type: Number, required: true }
})

increment({ name: 'Quiz', model: Quiz })

export default model('Quiz', Quiz)