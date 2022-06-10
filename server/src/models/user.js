import mongoose from "mongoose";
import { increment } from '../helpers/increment.js';
const { Schema, model } = mongoose;

const User = new Schema({
    _id: Number,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: false, default: null },
    roles: [{ type: String, default: 'user', enum: ['USER', 'ADMIN', 'GLOBAL_ADMIN'] }],
    level: { type: Number, ref: 'Level', required: true },
    result_games: [{ type: Number, ref: 'ResultGame', required: true }],
    create_games: [{ type: Number, ref: 'Quiz', required: false }],
    points: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
});

increment({ name: 'User', model: User })

export default model('User', User)