import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const Answer = new Schema({
    id: { type: Number, required: true },
    is_correct: { type: Boolean, required: true }
})

const ResultGame = new Schema({
    game: { type: Types.ObjectId, ref: 'Game', required: true },
    answers: [Answer],
    date_until: { type: Date, required: false },
    date_from: { type: Date, required: true },
    users: [{ type: Types.ObjectId, ref: 'User' }]
});


export default model('ResultGame', ResultGame)