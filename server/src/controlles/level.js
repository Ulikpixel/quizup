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

const checkName = async (name) => {
    const candidate = await Level.findOne({ name });
    return candidate
}

class LevelController {
    async createLevel(req, res) {
        try {
            const warning = validationResult(req);

            if (!warning.isEmpty()) {
                return res.status(400).json({
                    message: "Ошибка при регистрации", errors: warning.errors.map(w => ({ field: w.param, text: w.msg }))
                });
            }

            const { xp, name, img } = req.body;
            const candidate = await checkName(name);

            if(candidate) {
                return res.status(400).json({ message: 'Имя с таким названием уже существует', data: { name } });
            }

            const valids = await checkLevel(xp);

            if (valids.length !== 0) {
                return res.status(400).json({ message: "start_at и finish_at совпадают существующим промежутком" });
            }

            const level = await Level.create({ name, img, xp });

            res.json({ level });
        } catch (e) {
            console.log(e)
        }
    }
    async editLevel(req, res) {
        try {
            const id = req.params.id;
            const { name, img, xp } = req.body;
            const valids = (xp?.start_at && xp?.finish_at) ? await checkLevel(xp, id) : [];

            if (valids.length !== 0) {
                return res.status(400).json({ message: "start_at и finish_at совпадают существующим промежутком" });
            }

            const candidate = await checkName(name);

            if(candidate) {
                return res.status(400).json({ message: 'Имя с таким названием уже существует', data: { name } });
            }

            Level.findOneAndUpdate({ _id: id }, { name, img, xp }, { new: true })
                .then(data => {
                    res.json({ data })
                })
                .catch(() => {
                    res.status(400).json({ message: 'Такого уровня не существует', data: { level_id: id } });
                })
        } catch (e) {
            console.log(e)
        }
    }
    async deleteLevel(req, res) {
        try {
            const id = req.params.id;

            Level.findOneAndDelete({ _id: id }, (err, data) => {
                if (err) {
                    return res.status(400).json({ message: 'Такого уровня не существует', data: { level_id: id } })
                }
                res.json({ level: data })
            });
        } catch (e) {
            console.log(e)
        }
    }
    async getLevels(req, res) {
        try {
            const { level_id, name } = req.query;
            let query = {};

            if(level_id || name) {
                query = { $or: [(level_id && { _id: level_id }), (name && { name })].filter(el => el) }
            }

            Level.findOne(query)
                .then(data => {
                    res.json({ data })
                })
                .catch(() => {
                    res.status(400).json({ message: 'Такой уровень не найден', data: { query: req.query } });
                })
        } catch (e) {
            console.log(e)
        }
    }
}

export default new LevelController();