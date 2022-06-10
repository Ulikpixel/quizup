import Router from 'express';
import { check } from 'express-validator';
import controller from '../controlles/quiz.js';
import roleMiddleware from '../middleware/role.js';
import authMiddleware from '../middleware/auth.js';
const router = new Router();

router.post('/create_quiz',
    roleMiddleware(["ADMIN", "GLOBAL_ADMIN"]),
    [
        check('name', 'Поле name не может быть пустым').notEmpty(),
        check('level', 'Поле level не может быть пустым').notEmpty(),
        check('points', 'Поле points не может быть пустым').notEmpty(),
        check('points', 'Поле points должен быть числом').isNumeric(),
        check('asks', 'Количество вопросов должен быть больше 3 и меньше 60 символов').isLength({ min: 3, max: 60 }),
        check('xp', 'Поле xp не может быть пустым').notEmpty(),
        check('xp', 'Поле xp должен быть числом').isNumeric(),
        check('asks', 'Вопросы не правильно заполнены').custom(data => {
            const isFields = data.some(el => 
                el?.title === undefined || 
                el?.answers === undefined || 
                el?.is_correct === undefined ||
                el?.answers.length !== 4
            );

            return !isFields;
        })
    ],
    controller.createQuiz
);
router.get('/quizzes', authMiddleware, controller.getQuizzes);
router.put('/edit_quiz/:id', roleMiddleware(["ADMIN", "GLOBAL_ADMIN"]), controller.editQuiz);
router.delete('/delete_quiz/:id', roleMiddleware(["ADMIN", "GLOBAL_ADMIN"]), controller.deleteQuiz);

export default router;