
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import router from './src/routes/index.js';
import mongoose from 'mongoose';
import 'dotenv/config';

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json({ extended: true }))
app.use(fileUpload({}))
app.use('/api', router)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start()