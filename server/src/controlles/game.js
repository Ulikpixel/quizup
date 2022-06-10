import Quiz from '../models/quiz.js';
import ResultGame from '../models/resultGame.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import cron from 'node-cron';
import { validationResult } from 'express-validator';

class ResultGameController {
    async startGame(req, res) {
        try {
            const warning = validationResult(req);

            if (!warning.isEmpty()) {
                return res.status(400).json({
                    message: "Ошибка", error: warning.errors.map(w => ({ field: w.param, text: w.msg }))
                });
            }

            const { quiz: quizId } = req.body;
            const quiz = await Quiz.findOne({ _id: quizId });

            if (!quiz) {
                return res.status(200).json({ message: 'Такой игры не существует', error: { quiz_id: quizId } });
            }

            const token = req.headers.authorization.split(' ')[1]
            const { id: userId } = jwt.verify(token, process.env.SECRET_KEY)

            const { name, description, time, asks, points, level } = quiz;
            const { _id: id, date_from, status } = await ResultGame.create({
                quiz,
                user: userId,
                answers_correct: asks.map(el => ({
                    id: el.id,
                    is_correct: false,
                    answer: null,
                }))
            });

            await User.findOneAndUpdate({ _id: userId }, { $push: { result_games: id } })
            await Quiz.findOneAndUpdate({ _id: quizId }, { $push: { result_users: id } })

            const task = cron.schedule('0 0 */3 * * *', async () => {
                const currentGame = await ResultGame.findOne({ _id: id });
                task.stop();

                if(currentGame.status !== 'is_progress') return;

                await ResultGame.findOneAndUpdate({ _id: id }, { status: 'time_out', date_until: new Date() });
            })

            task.start()

            res.json({
                id, date_from, status, name, description, time, asks, points, level, quiz
            })
        } catch (e) {
            console.log(e)
        }
    }
    async addAnswer(req, res) {
        try {
            const warning = validationResult(req);

            if (!warning.isEmpty()) {
                return res.status(400).json({
                    message: "Ошибка", error: warning.errors.map(w => ({ field: w.param, text: w.msg }))
                });
            }

            const id = req.params.id;
            const { ask_id, answer } = req.body;

            const currentGame = await ResultGame.findOne({ _id: id });

            if(!currentGame) {
                return res.status(400).json({ message: 'Такой игры не существует', error: { game_id: id } });
            }

            if(currentGame.status !== 'is_progress') {
                return res.status(400).json({ message: 'Игра уже завершена', error: { game_id: id } });
            }

            const { asks } = await Quiz.findOne({ _id: currentGame.quiz });
            const currentAsk = asks?.find(el => el.id === ask_id);

            if(!currentAsk) {
                return res.status(400).json({ message: 'Такого вопроса не существует', error: { ask_id } });
            }

            const answers = [...currentGame.answers_correct];
            const idxAnswer = answers.findIndex(el => el.id === ask_id);

            if(answers[idxAnswer]?.answer !== null) {
                return res.status(400).json({ message: 'Этот вопрос уже отвечен', error: { ask_id } })
            }
            
            answers[idxAnswer] = {
                id: answers[idxAnswer].id,
                answer,
                is_correct: answer === currentAsk.is_correct
            };

            await ResultGame.findByIdAndUpdate(id, { answers_correct: answers });
            res.json({ answers: [...answers] });
        } catch(e) {
            console.log(e);
        }
    }
    async finishGame(req, res) {
        try {
            const warning = validationResult(req);

            if (!warning.isEmpty()) {
                return res.status(400).json({
                    message: "Ошибка", error: warning.errors.map(w => ({ field: w.param, text: w.msg }))
                });
            }

            const { game: id } = req.body;
            const game = await ResultGame.findOne({ _id: id });
            const quiz = await Quiz.findOne({ _id: game.quiz });

            if(!game) {
                return res.status(400).json({ message: 'Такой викторины не существует', error: { game_id: id } });
            }

            if(game.status !== 'is_progress') {
                return res.status(400).json({ message: 'Викторина уже завершена', error: { game } });
            }
     
            const currentGame = await ResultGame.findOneAndUpdate({ _id: id }, { status: 'finish', date_until: new Date() }, { new: true });
            const token = req.headers.authorization.split(' ')[1]
            const { id: userId } = jwt.verify(token, process.env.SECRET_KEY)

            if(!(currentGame.answers_correct.some(el => el.is_correct === false))) {
                await User.findOneAndUpdate({ _id: userId }, { $inc: { xp: quiz.xp, points: quiz.points } })
            } 

            res.json({ data: currentGame })
        } catch (e) {
            console.log(e)
        }
    }
}

export default new ResultGameController()