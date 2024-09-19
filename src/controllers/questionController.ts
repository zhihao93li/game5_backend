import { Request, Response } from 'express';
import QuestionService from '../services/questionService';
import { AuthRequest } from '../middleware/authMiddleware';
import UserAnswerRecordService from '../services/userAnswerRecordService';

export class QuestionController {
  private questionService: QuestionService;

  constructor() {
    this.questionService = new QuestionService();
  }

  async getNextQuestion(req: AuthRequest, res: Response) {
    const { quizSetId } = req.params;
    const userId = req.user?.userId;
    const userAnswerRecordService = new UserAnswerRecordService();

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    try {
      const progress = await userAnswerRecordService.getUserProgress(userId, quizSetId);
      const nextQuestionOrder = progress + 1;
      const question = await this.questionService.getQuestionByOrder(quizSetId, nextQuestionOrder);

      if (!question) {
        return res.status(404).json({ message: '没有更多问题' });
      }

      res.status(200).json(question);
    } catch (error) {
      res.status(500).json({ message: '获取问题失败', error: (error as Error).message });
    }
  }

  async submitAnswer(req: AuthRequest, res: Response) {
    const { quizSetId } = req.params;
    const { optionNumber, orderInSet } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    try {
      const result = await this.questionService.submitAnswer(userId, quizSetId, optionNumber, orderInSet);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: '提交答案失败', error: (error as Error).message });
    }
  }

  async getQuestionByOrder(req: AuthRequest, res: Response) {
    const { quizSetId, orderInSet } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    try {
      const question = await this.questionService.getQuestionByOrder(quizSetId, Number(orderInSet));
      res.status(200).json(question);
    } catch (error) {
      res.status(500).json({ message: '获取问题失败', error: (error as Error).message });
    }
  }

  async getQuestionInfoByUser(req: AuthRequest, res: Response) {
    const { quizSetId } = req.params;
    const userId = req.user?.userId;

    console.log('getQuestionInfoByUser controller called with:', { quizSetId, userId });

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    try {
      const questionInfo = await this.questionService.getQuestionInfoByUser(userId, quizSetId);
      console.log('Question info retrieved:', questionInfo);
      res.status(200).json(questionInfo);
    } catch (error) {
      console.error('Error in getQuestionInfoByUser:', error);
      res.status(500).json({ message: '获取问题信息失败', error: (error as Error).message });
    }
  }

}

export const questionController = new QuestionController();
