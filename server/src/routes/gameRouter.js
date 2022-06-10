import Router from 'express';
import { check } from 'express-validator';
import controller from '../controlles/game.js';
import authMiddleware from '../middleware/auth.js';
const router = new Router();

router.post('/start_game',
    authMiddleware,
    [
        check('quiz', 'Поле quiz не может быть пустым').notEmpty(),
    ],
    controller.startGame
);
router.put('/add_answer/:id', 
    authMiddleware,
    [
        check('ask_id', 'Поле ask_id не может быть пустым').notEmpty(),
        check('answer', 'Поле answer не может быть пустым').notEmpty(),
    ], 
    controller.addAnswer
    );
router.post(
    '/finish_game', 
    authMiddleware, 
    [
        check('game', 'Поле game не может быть пустым').notEmpty(),
    ],
    controller.finishGame
);

export default router;