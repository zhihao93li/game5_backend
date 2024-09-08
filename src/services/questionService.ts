import { IQuestion } from '../models/Question';
import Question from '../models/Question';
import UserAnswerRecordService from './userAnswerRecordService';

export default class QuestionService {
  private userAnswerRecordService: UserAnswerRecordService;

  constructor() {
    this.userAnswerRecordService = new UserAnswerRecordService();
  }

  async getQuestionByOrder(quizSetId: string, orderInSet: number): Promise<IQuestion | null> {
    return Question.findOne({ quizSetId, orderInSet });
  }

  async getAllQuestionsForQuizSet(quizSetId: string): Promise<IQuestion[]> {
    return Question.find({ quizSetId }).sort({ orderInSet: 1 });
  }

  async submitAnswer(userId: string, quizSetId: string, optionNumber: string, orderInSet: number) {
    try {
      const updatedRecord = await this.userAnswerRecordService.updateRecord(userId, quizSetId, optionNumber, orderInSet);
      const similarPathsCount = await this.userAnswerRecordService.getSimilarPathsCount(userId, quizSetId);

      return {
        progress: updatedRecord.progress,
        completed: updatedRecord.completed,
        similarPathsCount
      };
    } catch (error) {
      throw new Error(`提交答案失败: ${(error as Error).message}`);
    }
  }
}
