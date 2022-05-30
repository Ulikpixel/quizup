import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Level from '../models/level.js';

const generateAccessToken = (id, roles) => jwt.sign({ id, roles }, process.env.SECRET_KEY, { expiresIn: "24h" });

class AuthController {
    async signup(req, res) {
        try {
            const warning = validationResult(req)

            if (!warning.isEmpty()) {
                return res.status(400).json({
                    message: "Ошибка при регистрации", errors: warning.errors.map(w => ({ field: w.param, text: w.msg }))
                })
            }

            const { username, password, email } = req.body;
            const candidate = await User.findOne({ username })

            if (candidate) {
                return res.status(400).json({ message: "Пользователь с таким именем уже существует", errors: null })
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const level = await Level.findOne({ name: 'Простолюдин' });
            
            const user = await User.create({
                username,
                password: hashPassword,
                roles: ['USER'],
                email,
                points: 0,
                level: level._id,
            })
            const token = generateAccessToken(user._id, user.roles);

            return res.json({ message: "Пользователь успешно зарегистрирован", data: { user, token } })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Ошибка регистраций', errors: null })
        }
    }

    async signin(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })

            if (!user) {
                return res.status(400).json({ message: `Пользователь ${username} не найден`, errors: null })
            }

            const validPassword = bcrypt.compareSync(password, user.password)

            if (!validPassword) {
                return res.status(400).json({ message: `Введен неверный пароль`, errors: null })
            }

            const token = generateAccessToken(user._id, user.roles)
            return res.json({ token, username, id: user.id, roles: user.roles })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Ошибка авторизаций', errors: null })
        }
    }
    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users.map(({ username, roles, id }) => ({ id, username, roles })))
        } catch (e) {
            console.log(e)
        }
    }
}

export default new AuthController()