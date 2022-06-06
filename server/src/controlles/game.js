import Game from '../models/game.js';
import ResultGame from '../models/resultGame.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import cron from 'node-cron';

const saveResult = async ({ id_user, id_result_game }) => {
    return await User.updateOne(
        { _id: id_user }, 
        { $push: { result_games: [id_result_game] } },
        (err, result) => {
            err ? console.log(err) : result;
        }
    )
}

class ResultGameController {
    async startGame(req, res) {
        try {
            const { game: gameId } = req.body;
            const game = await Game.findOne({ _id: gameId });

            if (!game) {
                return res.status(200).json({ message: 'Такой игры не существует', data: { game_id: gameId } });
            }

            const token = req.headers.authorization.split(' ')[1]
            const { id: userId } = jwt.verify(token, process.env.SECRET_KEY)

            const { name, description, time, asks, points, level } = game;
            const { _id: id, date_from, status } = await ResultGame.create({
                game: gameId,
                user: userId,
                answers_correct: asks.map(el => ({
                    id: el.id,
                    is_correct: false,
                    answer: null,
                }))
            });

            const task = cron.schedule('0 10 * * *', async () => {
                const currentGame = await ResultGame.findOne({ _id: id });

                if (currentGame.status === 'is_progress') {
                    await ResultGame.findOneAndUpdate({ _id: id }, {
                        status: 'time_out',
                        date_from: new Date()
                    })
                    task.stop();
                }
            });
            task.start();

            res.json({
                id, date_from, status, name, description, time, asks, points, level
            })
        } catch (e) {
            console.log(e)
        }
    }
    async addAnswer(req, res) {
        try {
            const id = req.params.id;
            const { ask_id, answer } = req.body;

            const currentGame = await ResultGame.findOne({ _id: id });

            if(!currentGame) {
                return res.status(400).json({ message: 'Такой игры не существует', data: { game_id: id } });
            }

            const { asks } = await Game.findOne({ _id: currentGame.game });
            const currentAsk = asks?.find(el => el.id === ask_id);

            if(!currentAsk) {
                return res.status(400).json({ message: 'Такого вопроса не существует', data: { ask_id } });
            }

            const answers = [...currentGame.answers_correct];
            const idxAnswer = answers.findIndex(el => el.id === ask_id);

            if(answers[idxAnswer]?.answer !== null) {
                return res.status(400).json({ message: 'Этот вопрос уже отвечен', data: { ask_id } })
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
            const id = req.params.id;
            const token = req.headers.authorization.split(' ')[1]
            const { id: id_user } = jwt.verify(token, process.env.SECRET_KEY);

            saveResult({ id_user, id_result_game: id })
                .then(() => res.json({ asd: 'asd' }))
        } catch (e) {
            console.log(e)
        }
    }
}

export default new ResultGameController()