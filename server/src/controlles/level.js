import { validationResult } from 'express-validator';
import Level from '../models/level.js';

const checkLevel = async ({ start_at, finish_at }, id) => {
    const levels = await Level.find();
    const valids = [];

    levels.filter(el => el.id !== id).forEach(({ xp }) => {
        for (let i = xp.start_at; i <= xp.finish_at; i++) {
            for (let j = start_at; j <= finish_at; j++) {
                if (i === j) {
                    valids.push(i)
                }
            }
        }
    })

    return valids;
}

const checkName = async name => await Level.findOne({ name });

const getLevel = ({ id, name, img, xp }) => ({ id, name, img, xp });

class LevelController {
    async createLevel(req, res) {
        try {
            const warning = validationResult(req);

            if (!warning.isEmpty()) {
                return res.status(400).json({
                    message: "Ошибка при созданий вопроса", error: warning.errors.map(w => ({ field: w.param, text: w.msg }))
                });
            }

            const { xp, name, img } = req.body;
            const candidate = await checkName(name);

            if (candidate) {
                return res.status(400).json({ message: 'Уровень с таким названием уже существует', error: { name } });
            }

            const valids = await checkLevel(xp);

            if (valids.length !== 0) {
                return res.status(400).json({ message: "start_at и finish_at совпадают существующим промежутком", error: null });
            }

            const level = await Level.create({ name, img, xp });

            res.json({ ...getLevel(level) });
        } catch (e) {
            res.status(400).json({ message: "Ошибка при созданий вопроса", error: null });
            console.log(e)
        }
    }
    async editLevel(req, res) {
        try {
            const warning = validationResult(req);

            if (!warning.isEmpty()) {
                return res.status(400).json({
                    message: "Ошибка при редактирований вопроса", error: warning.errors.map(w => ({ field: w.param, text: w.msg }))
                });
            }

            const id = req.params.id;
            const { name, img, xp } = req.body;
            const currentLevel = await Level.findOne({ _id: id });

            if (!currentLevel) {
                return res.status(400).json({ message: 'Такого уровня не существует', error: { level_id: id } });
            }

            const valids = xp ? await checkLevel(xp, id) : [];

            if (valids.length !== 0) {
                return res.status(400).json({ message: "start_at и finish_at совпадают существующим промежутком", error: null });
            }

            if (name) {
                const candidate = await checkName(name);

                if (candidate) {
                    return res.status(400).json({ message: 'Имя с таким названием уже существует', error: { name } });
                }
            }

            const newLevel = await Level.findOneAndUpdate({ _id: id }, { name, img, xp }, { new: true });
            res.json({ ...getLevel(newLevel) })
        } catch (e) {
            res.status(400).json({ message: "Ошибка при редактирований вопроса", error: null });
            console.log(e)
        }
    }
    deleteLevel(req, res) {
        try {
            const id = req.params.id;

            Level.findOneAndDelete({ _id: id })
                .then(data => res.json({ ...getLevel(data) }))
                .catch(() => res.status(400).json({ message: 'Такого уровня не существует', error: { level_id: id } }))
        } catch (e) {
            console.log(e)
        }
    }
    getLevels(req, res) {
        try {
            const { level_id, q } = req.query;
            const params = [
                (level_id && { _id: level_id }),
                (q && { name: new RegExp(q, 'i') })
            ].filter(el => el);

            Level.find(params.length > 0 ? { $or: params } : {})
                .then(data => res.json({ list: data.map(el => getLevel(el)) }))
                .catch(() => res.status(400).json({ message: 'Такой уровень не найден', error: { query: req.query } }))
        } catch (e) {
            console.log(e)
        }
    }
}

export default new LevelController();