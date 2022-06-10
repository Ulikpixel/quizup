import mongoose from "mongoose";
import { increment } from '../helpers/increment.js';
const { Schema, model } = mongoose;

const Answer = new Schema({
    id: { type: Number, required: true },
    is_correct: { type: Boolean, required: true },
    answer: { type: String, required: false }
}, { _id: false })

const ResultGame = new Schema({
    _id: Number,
    date_from: { type: Date, default: new Date() },
    date_until: { type: Date, default: null },
    quiz: { type: Number, ref: 'Quiz', required: true },
    user: { type: Number, ref: 'User' },
    status: { type: String, default: 'is_progress', enum: ['is_progress', 'finish', 'time_out'] },
    answers_correct: [Answer]
});

increment({ name: 'ResultGame', model: ResultGame })

export default model('ResultGame', ResultGame)