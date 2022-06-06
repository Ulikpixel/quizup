import mongoose from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;

const User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: false, default: null },
    roles: [{ type: String, default: 'user', enum : ['USER', 'ADMIN', 'GLOBAL_ADMIN'] }],
    level: { type: SchemaTypes.ObjectId, ref: 'Level', required: true },
    result_games: [{ type: SchemaTypes.ObjectId, ref: 'ResultGame', required: true }],
    create_games: [{ type: SchemaTypes.ObjectId, ref: 'Game', required: false }],
    points: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
});


export default model('User', User)