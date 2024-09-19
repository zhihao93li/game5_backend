import { Request, Response } from 'express';
import QuizSetService from '../services/quizSetService';
import UserAnswerRecordService from '../services/userAnswerRecordService';
import { AuthRequest } from '../middleware/authMiddleware';
import { RequestHandler } from 'express';

export class QuizSetController {
  private quizSetService: QuizSetService;
  private userAnswerRecordService: UserAnswerRecordService;

  constructor() {
    this.quizSetService = new QuizSetService();
    this.userAnswerRecordService = new UserAnswerRecordService();
  }

  async getAllQuizSetsWithProgress(req: AuthRequest, res: Response) {
    try {
      const quizSets = await this.quizSetService.getAllQuizSets();
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: '未授权' });
      }

      const quizSetsWithProgress = await Promise.all(quizSets.map(async (quizSet) => {
        const userRecord = await this.userAnswerRecordService.getRecord(userId, quizSet.quizSetId);
        return {
          ...quizSet.toObject(),
          progress: userRecord ? userRecord.progress : 0,
          completed: userRecord ? userRecord.completed : false
        };
      }));

      res.status(200).json(quizSetsWithProgress);
    } catch (error) {
      res.status(500).json({ message: '获取题库列表失败', error: (error as Error).message });
    }
  }

  async resetUserAnswerRecord(req: AuthRequest, res: Response) {
    const { quizSetId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    try {
      await this.userAnswerRecordService.resetRecord(userId, quizSetId);
      res.status(200).json({ wasReset: true });
    } catch (error) {
      res.status(500).json({ message: '重置答题记录失败', error: (error as Error).message });
    }
  }

  async getSummary(req: AuthRequest, res: Response) {
    const { quizSetId } = req.params;
    const userId = req.user?.userId;
  
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }
  
    try {
      const userAnswerRecordService = new UserAnswerRecordService();
      const summary = await userAnswerRecordService.getSummary(userId, quizSetId);
      res.status(200).json(summary);
    } catch (error) {
      res.status(500).json({ message: '获取Summary失败', error: (error as Error).message });
    }
  }

  async getQuizSetById(req: AuthRequest, res: Response) {
    const { quizSetId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    try {
      const quizSet = await this.quizSetService.getQuizSetById(quizSetId);
      if (!quizSet) {
        return res.status(404).json({ message: '题库不存在' });
      }

      const userRecord = await this.userAnswerRecordService.getRecord(userId, quizSetId);
      const quizSetWithProgress = {
        ...quizSet.toObject(),
        progress: userRecord ? userRecord.progress : 0,
        completed: userRecord ? userRecord.completed : false
      };

      res.status(200).json(quizSetWithProgress);
    } catch (error) {
      res.status(500).json({ message: '获取题库失败', error: (error as Error).message });
    }
  }
}

export const quizSetController = new QuizSetController();