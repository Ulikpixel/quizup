import mongoose from "mongoose";
import { increment } from '../helpers/increment.js';
const { Schema, model } = mongoose;

const Level = new Schema({
    _id: Number,
    name: { type: String, required: true, unique: true },
    img: { type: String, required: true, unique: true },
    xp: {
        start_at: { type: Number, required: true },
        finish_at: { type: Number, required: true },
    },
});

increment({ name: 'Level', model: Level })

export default model('Level', Level)