import Router from 'express';
import { check } from 'express-validator';
import controller from '../controlles/game.js';
import authMiddleware from '../middleware/auth.js';
const router = new Router();

router.post('/start_game',
    authMiddleware,
    [
        check('game', 'Поле game не может быть пустым').notEmpty()
    ],
    controller.startGame
);
router.put('/add_answer/:id', authMiddleware, controller.addAnswer);
router.put('/finish_game/:id', authMiddleware, controller.finishGame);

export default router;