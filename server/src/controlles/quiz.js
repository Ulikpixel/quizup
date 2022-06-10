import Quiz from '../models/quiz.js';
import Level from '../models/level.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

class QuizController {
    async createQuiz(req, res) {
        try {
            const warning = validationResult(req);

            if (!warning.isEmpty()) {
                return res.status(400).json({
                    message: "Ошибка при созданий викторины", error: warning.errors.map(w => ({ field: w.param, text: w.msg }))
                });
            }

            const { name, level } = req.body;

            const candidate = await Quiz.findOne({ $and: [{ level }, { name }] });

            if (candidate) {
                return res.status(400).json({ message: 'Викторина с таким именем и уровнем существует', error: null })
            }

            const currentLevel = await Level.findOne({ _id: level });

            if (!currentLevel) {
                return res.status(400).json({ message: 'Такой уровень не существует', error: { level_id: level } });
            }

            const token = req.headers.authorization.split(' ')[1]
            const { id: userId } = jwt.verify(token, process.env.SECRET_KEY);
            const QuizBody = { ...req.body, owner: userId, asks: req.body.asks.map((el, idx) => ({ ...el, id: idx + 1 })) };

            const quiz = await Quiz.create({ ...QuizBody });

            res.json({ id: quiz._id, ...QuizBody });
        } catch (e) {
            res.status(400).json({ message: 'Ошибка при созданий викторины', error: { level_id: level } });
            console.log(e)
        }
    }
    async editQuiz(req, res) {
        try {

        } catch (e) {
            console.log(e);
        }
    }
    deleteQuiz(req, res) {
        try {
            const id = req.params.id;

            Quiz.findOneAndDelete({ _id: id })
                .then(({ data }) => res.json({ data }))
                .catch(() => res.status(400).json({ message: 'Такой викторины не существует', error: { quiz_id: id } }))
        } catch (e) {
            console.log(e);
        }
    }
    async getQuizzes(req, res) {
        try {
            const { q, level, owner } = req.query;
            const params = [
                (q && { name: new RegExp(q, 'i') }),
                (level && { level }),
                (owner && { owner })
            ].filter(el => el);


            const Quizzes = await Quiz.find(params.length > 0 ? { $and: params } : {});
            res.json({ list: Quizzes });
        } catch (e) {
            console.log(e);
        }
    }
}

export default new QuizController()