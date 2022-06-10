import Router from 'express';
import { check } from 'express-validator';
import controller from '../controlles/level.js';
import roleMiddleWare from '../middleware/role.js';
import authMiddleware from '../middleware/auth.js';
const router = new Router();

router.post('/create_level', 
    roleMiddleWare(["ADMIN", "GLOBAL_ADMIN"]), 
    [
        check('name', 'поле name не может быть пустым').notEmpty(),
        check('img', 'поле img не может быть пустым').notEmpty(),
        check('xp', 'поле xp не может быть пустым').notEmpty(),
        check('xp', 'поле start_at и finish_at не могут быть пустыми').custom(data => data?.start_at !== undefined && data?.finish_at !== undefined),
        check('xp', 'поле start_at и finish_at должны быть тип Number').custom(data => typeof data.start_at === 'number' && typeof data.finish_at === 'number'),
    ],
    controller.createLevel
);
router.put('/edit_level/:id', 
    roleMiddleWare(["ADMIN", "GLOBAL_ADMIN"]),
    controller.editLevel
);
router.delete('/delete_level/:id', roleMiddleWare(["ADMIN", "GLOBAL_ADMIN"]), controller.deleteLevel);
router.get('/levels', authMiddleware, controller.getLevels);

export default router;