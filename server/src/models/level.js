import mongoose from "mongoose";
const { Schema, Types, model } = mongoose;

const Level = new Schema({
    name: { type: String, required: true, unique: true },
    img: { type: String, required: true, unique: true },
    points: {
        start_at: { type: Number, required: true },
        finish_at: { type: Number, required: true }, 
    },
});


export default model('Level', Level)