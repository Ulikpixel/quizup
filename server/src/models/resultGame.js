import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const Answer = new Schema({
    id: { type: Number, required: true },
    is_correct: { type: Boolean, required: true },
    answer: { type: String, required: false }
})

const ResultGame = new Schema({
    date_from: { type: Date, default: new Date() },
    date_until: { type: Date, required: false },
    game: { type: SchemaTypes.ObjectId, ref: 'Game', required: true },
    user: { type: SchemaTypes.ObjectId, ref: 'User' },
    status: { type: String, default: 'is_progress' },
    answers_correct: [Answer]
});


export default model('ResultGame', ResultGame)