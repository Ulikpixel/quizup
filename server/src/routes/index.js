import Router from "express";
import authRouter from './authRouter.js';
import quizRouter from './quizRouter.js';
import gameRouter from './gameRouter.js';
import levelRouter from './levelRouter.js';

const router = new Router();
router.use('/auth', authRouter);
router.use('/quiz', quizRouter);
router.use('/game', gameRouter);
router.use('/level', levelRouter);

export default router;