import express from 'express';
import BoardController from '../controllers/board';

const router = express.Router();

router.route('/board/:id').get(BoardController.getBoard);
router.route('/board/:id').put(BoardController.editBoard);

export default router;