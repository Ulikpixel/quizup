import mongoose from "mongoose";
const { Schema, model } = mongoose;

const Counter = new Schema({
    name: { type: String, required: true },
    count: { type: Number, default: 0 } 
});


export default model('Counter', Counter)