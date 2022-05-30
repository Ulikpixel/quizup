import Router from "express";
import authRouter from './authRouter.js';

const router = new Router();
router.use('/auth', authRouter);

export default router;