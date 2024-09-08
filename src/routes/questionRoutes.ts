import express from 'express';
import { QuestionController } from '../controllers/questionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const questionController = new QuestionController();

router.get('/next/:quizSetId', authMiddleware, questionController.getNextQuestion.bind(questionController));
router.get('/:quizSetId/:orderInSet', authMiddleware, questionController.getQuestionByOrder);
router.post('/submit/:quizSetId', authMiddleware, questionController.submitAnswer.bind(questionController));

export default router;
