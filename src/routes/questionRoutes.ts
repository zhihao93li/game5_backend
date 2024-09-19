import express from 'express';
import { QuestionController } from '../controllers/questionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const questionController = new QuestionController();

// 添加一个日志
console.log('Setting up question routes');

// 将具体路由放在通用路由之前
router.get('/info/:quizSetId', authMiddleware, questionController.getQuestionInfoByUser.bind(questionController));
router.get('/next/:quizSetId', authMiddleware, questionController.getNextQuestion.bind(questionController));
router.get('/:quizSetId/:orderInSet', authMiddleware, questionController.getQuestionByOrder.bind(questionController));
router.post('/submit/:quizSetId', authMiddleware, questionController.submitAnswer.bind(questionController));

export default router;
