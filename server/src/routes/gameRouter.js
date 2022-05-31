import Router from 'express';
import { check } from 'express-validator';
import controller from '../controlles/game.js';
import roleMiddleware from '../middleware/role.js';
const router = new Router();

router.post('/create_game',
    roleMiddleware(["ADMIN"]),
    [
        check('name', 'Поле name не может быть пустым').notEmpty(),
        check('level', 'Поле level не может быть пустым').notEmpty(),
        check('points', 'Поле points не может быть пустым или строкой').notEmpty().isNumeric(),
        check('asks', 'Количество вопросов должен быть больше 3 и меньше 60 символов').isLength({ min: 3, max: 60 }),
        check('time', 'Поле time не может быть пустым или строкой').notEmpty().isNumeric(),
    ],
    controller.createGame
);
router.put('/edit_game/:id', roleMiddleware(["ADMIN"]), controller.editGame);
router.delete('/delete_game/:id', roleMiddleware(["ADMIN"]), controller.deleteGame);
router.get('/games', roleMiddleware(["ADMIN"]), controller.getGames);

export default router;