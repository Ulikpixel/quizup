import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const Ask = new Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    answers: [String],
    is_correct: { type: Number, required: true }
});


const Game = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    level: { type: Types.ObjectId, ref: 'Level', required: true },
    points: { type: Number, required: true },
    owner: { type: Types.ObjectId, ref: 'User' },
    asks: [Ask],
});


export default model('Game', Game)