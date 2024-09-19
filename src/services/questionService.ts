import { IQuestion } from '../models/Question';
import Question from '../models/Question';
import UserAnswerRecordService from './userAnswerRecordService';
import QuizSet from '../models/QuizSet';

class QuestionService {
  private userAnswerRecordService: UserAnswerRecordService;

  constructor() {
    this.userAnswerRecordService = new UserAnswerRecordService();
  }

  async getQuestionByOrder(quizSetId: string, orderInSet: number): Promise<IQuestion | null> {
    console.log('Getting question by order:', { quizSetId, orderInSet });
    if (typeof orderInSet !== 'number' || isNaN(orderInSet) || orderInSet <= 0) {
      throw new Error(`Invalid orderInSet: ${orderInSet}`);
    }
    const question = await Question.findOne({ quizSetId, orderInSet });
    console.log('Found question:', question);
    return question;
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

  async getQuestionInfoByUser(userId: string, quizSetId: string) {
    console.log('getQuestionInfoByUser called with:', { userId, quizSetId });
    
    const userProgress = await this.userAnswerRecordService.getUserProgress(userId, quizSetId);
    console.log('User progress:', userProgress);

    const quizSet = await QuizSet.findOne({ quizSetId });
    console.log('Quiz set:', quizSet);
    
    if (!quizSet) {
      throw new Error('题库不存在');
    }

    if (typeof userProgress !== 'number' || isNaN(userProgress)) {
      throw new Error(`Invalid userProgress: ${userProgress}`);
    }

    if (typeof quizSet.totalQuestions !== 'number' || isNaN(quizSet.totalQuestions)) {
      throw new Error(`Invalid totalQuestions: ${quizSet.totalQuestions}`);
    }

    const similarPathsCount = await this.userAnswerRecordService.getSimilarPathsCount(userId, quizSetId);
    console.log('Similar paths count:', similarPathsCount);

    // 检查用户是否已完成所有问题
    if (userProgress === quizSet.totalQuestions) {
      return {
        currentProgress: userProgress,
        totalQuestions: quizSet.totalQuestions,
        nextQuestionOrder: null,
        nextQuestionContent: null,
        similarPathsCount: similarPathsCount,
        completed: true
      };
    }

    const nextQuestionOrder = userProgress + 1;
    console.log('Next question order:', nextQuestionOrder);

    const nextQuestion = await this.getQuestionByOrder(quizSetId, nextQuestionOrder);
    console.log('Next question:', nextQuestion);

    return {
      currentProgress: userProgress,
      totalQuestions: quizSet.totalQuestions,
      nextQuestionOrder: nextQuestionOrder,
      nextQuestionContent: nextQuestion ? nextQuestion.content : null,
      similarPathsCount: similarPathsCount,
      completed: false
    };
  }
}

export default QuestionService;
