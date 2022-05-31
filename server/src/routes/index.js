import Router from "express";
import authRouter from './authRouter.js';
import gameRouter from './gameRouter.js';

const router = new Router();
router.use('/auth', authRouter);
router.use('/game', gameRouter);

export default router;