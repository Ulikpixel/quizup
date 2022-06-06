import Router from 'express';
import { check } from 'express-validator';
import controller from '../controlles/quiz.js';
import roleMiddleware from '../middleware/role.js';
import authMiddleware from '../middleware/auth.js';
const router = new Router();

router.post('/create_quiz',
    roleMiddleware(["ADMIN"]),
    [
        check('name', 'Поле name не может быть пустым').notEmpty(),
        check('level', 'Поле level не может быть пустым').notEmpty(),
        check('points', 'Поле points не может быть пустым или строкой').notEmpty().isNumeric(),
        check('asks', 'Количество вопросов должен быть больше 3 и меньше 60 символов').isLength({ min: 3, max: 60 })
    ],
    controller.createQuiz
);
router.put('/edit_quiz/:id', roleMiddleware(["ADMIN"]), controller.editQuiz);
router.delete('/delete_quiz/:id', roleMiddleware(["ADMIN"]), controller.deleteQuiz);
router.get('/all_quiz', authMiddleware, controller.getQuiz);

export default router;