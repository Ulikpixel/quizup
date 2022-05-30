import Router from 'express';
import { check } from 'express-validator';
import controller from '../controlles/auth.js';
import roleMiddleware from '../middleware/role.js';
const router = new Router();

router.post('/signup', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 4 и меньше 12 символов').isLength({ min: 4, max: 12 })
], controller.signup)
router.post('/signin', controller.signin)
router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers)

export default router;