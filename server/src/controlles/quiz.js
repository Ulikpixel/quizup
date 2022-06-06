import Game from '../models/game.js';
import Level from '../models/level.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

class QuizController {
    async createQuiz(req, res) {
        try {
            const warning = validationResult(req);

            if (!warning.isEmpty()) {
                return res.status(400).json({
                    message: "Ошибка при созданий викторины", errors: warning.errors.map(w => ({ field: w.param, text: w.msg }))
                });
            }

            const { name, level } = req.body;

            const candidateOne = await Game.findOne({ $and: [{ level }, { name }] });
            const candidateTwo = await Game.findOne({ name });

            if(candidateOne) {
                return res.status(400).json({ message: 'Викторина с таким именем и уровнем существует', data: null })
            }
            if(candidateTwo) {
                return res.status(400).json({ message: 'Викторина с таким именем существует', data: null })
            }
            
            const currentLevel = await Level.findOne({ _id: level });

            if(!currentLevel) {
                return res.status(400).json({ message: 'Такой уровень не существует', data: null })
            }

            const token = req.headers.authorization.split(' ')[1]
            const { id: userId } = jwt.verify(token, process.env.SECRET_KEY);
            const gameBody = { ...req.body, owner: userId, asks: req.body.asks.map((el, idx) => ({ ...el, id: idx + 1 })) };

            const game = await Game.create({ ...gameBody });

            res.json({ id: game._id, ...gameBody });
        } catch (e) {
            console.log(e)
        }
    }
    async editQuiz(req, res) {
        try {

        } catch(e) {    
            console.log(e);
        }
    }
    async deleteQuiz(req, res) {
        try {
            const _id = req.params.id;
            const candidate = await Game.findOne({ _id });
    
            if(!candidate) {
                return res.status(400).json({ message: `Викторина с таким "${_id}" айдишником не существует`, data: null })
            }
    
            await Game.deleteOne({ _id });
            res.json({ message: 'Викторина успешно удалена', data: { id: _id, name: candidate.name } });
        } catch(e) {
            console.log(e);
        }
    }
    async getQuiz(req, res) {
        try {
            const games = await Game.find();
            res.json({ games });
        } catch(e) {
            console.log(e);
        }
    }
}

export default new QuizController()