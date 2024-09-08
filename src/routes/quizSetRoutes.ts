import express from 'express';
import { QuizSetController } from '../controllers/quizSetController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const quizSetController = new QuizSetController();

router.get('/', authMiddleware, quizSetController.getAllQuizSetsWithProgress.bind(quizSetController));
router.post('/reset-answer-record/:quizSetId', authMiddleware, quizSetController.resetUserAnswerRecord.bind(quizSetController));

export default router;
