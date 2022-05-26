import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: false },
    roles: [{ type: String, default: 'User' }],
    level: { type: Types.ObjectId, ref: 'Level', required: true },
    result_games: [{ type: Types.ObjectId, ref: 'ResultGame', required: true }],
    create_games: [{ type: Types.ObjectId, ref: 'Game', required: false }],
    points: { type: Number, required: true },
});


export default model('User', User)