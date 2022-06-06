import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const Ask = new Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    answers: [String],
    is_correct: { type: Number, required: true },
});

const Game = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    level: { type: SchemaTypes.ObjectId, ref: 'Level', required: true },
    points: { type: Number, required: true },
    owner: { type: SchemaTypes.ObjectId, ref: 'User' },
    asks: [Ask],
    result_users: [{ type: SchemaTypes.ObjectId, ref: 'ResultGame' }],
})


export default model('Game', Game)