import Router from 'express';
import { check } from 'express-validator';
import controller from '../controlles/auth.js';
import authMiddleWare from '../middleware/auth.js';
const router = new Router();

router.post('/signup', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 4 и меньше 12 символов').isLength({ min: 4, max: 12 })
], controller.signup)
router.put('/signin', controller.signin)
router.get('/users', authMiddleWare, controller.getUsers)

export default router;