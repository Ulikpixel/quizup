import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Level from '../models/level.js';

const generateAccessToken = (id, roles) => jwt.sign({ id, roles }, process.env.SECRET_KEY, { expiresIn: "24h" });

const getLevel = ({ id, name, img, xp }) => ({ id, name, img, xp });

const getDataUser = async ({ _id: id, username, email = null, roles, result_games, owner_games, level, points }) => {
    const currentLevel = await Level.findOne({ _id: level });
    return {
        id, username, roles, result_games, points,
        email: email || [],
        level: currentLevel,
        ...(roles.includes('ADMIN') && { owner_games: owner_games || [] })
    }
};

class AuthController {
    async signup(req, res) {
        try {
            const warning = validationResult(req);

            if (!warning.isEmpty()) {
                return res.status(400).json({
                    message: "Ошибка при регистрации", error: warning.errors.map(w => ({ field: w.param, text: w.msg }))
                });
            }

            const { body } = req;
            const candidate = await User.findOne({ username: body.username });

            if (candidate) {
                return res.status(400).json({ message: "Пользователь с таким именем уже существует", error: null });
            }

            const hashPassword = bcrypt.hashSync(body.password, 7);
            const levelStart = await Level.findOne({ name: 'Простолюдин' });

            const user = await User.create({
                username: body.username,
                password: hashPassword,
                roles: ['USER'],
                email: body?.email,
                points: 0,
                level: levelStart,
            });
            const { _id: id, username, roles, email } = user;
            const token = generateAccessToken(user._id, user.roles);

            res.json({
                message: "Пользователь успешно зарегистрирован",
                data: { id, username, email, roles, level: getLevel(levelStart), points: 0, result_games: [], token },
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Ошибка регистраций', error: null });
        }
    }

    async signin(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });

            if (!user) {
                return res.status(400).json({ message: `Пользователь ${username} не найден`, error: null });
            }

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                return res.status(400).json({ message: 'Введен неверный пароль', error: null });
            }

            const token = generateAccessToken(user._id, user.roles);
            const dataUser = await getDataUser(user);
            res.json({ message: "Пользователь успешно авторизирован", data: { token, ...dataUser } });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Ошибка авторизаций', error: null });
        }
    }
    async getUsers(req, res) {
        try {
            const { q, level, email, user_id } = req.query;
            const params = [
                (q && { username: new RegExp(q, 'i') }),
                (level && { level }),
                (email && { email: new RegExp(email, 'i') }),
                (user_id && { _id: user_id })
            ].filter(el => el);
            
            const users = await User.find(params.length > 0 ? { $and: params } : {});

            res.json({ list: users.map(({ username, roles, id }) => ({ id, username, roles })) });
        } catch (e) {
            console.log(e)
        }
    }
}

export default new AuthController()