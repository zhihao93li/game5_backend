import { IUserAnswerRecord } from '../models/UserAnswerRecord';
import UserAnswerRecord from '../models/UserAnswerRecord';
import QuizSet from '../models/QuizSet';
import Question from '../models/Question';

// 或者直接在文件中定义接口
interface SummaryData {
  answers: string[];
  similarPathsCount: number;
}

interface QuizAnswer {
  questionNumber: number;
  userAnswer: string;
}

export class UserAnswerRecordService {
  async createRecord(userId: string, quizSetId: string): Promise<IUserAnswerRecord> {
    const quizSet = await QuizSet.findOne({ quizSetId });
    if (!quizSet) {
      throw new Error('Quiz set not found');
    }
    
    const recordId = `${userId}_${quizSetId}`;
    const record = new UserAnswerRecord({
      recordId,
      userId,
      quizSetId,
      answers: new Array(quizSet.totalQuestions).fill(''),
      progress: 0,
      completed: false
    });

    await record.save();
    return record;
  }

  async updateRecord(userId: string, quizSetId: string, optionNumber: string, orderInSet: number): Promise<IUserAnswerRecord> {
    const recordId = `${userId}_${quizSetId}`;
    let record = await UserAnswerRecord.findOne({ recordId });
    if (!record) {
      record = await this.createRecord(userId, quizSetId);
    }

    const question = await Question.findOne({ quizSetId, orderInSet });
    if (!question) {
      throw new Error('Question not found');
    }

    const isValidOption = question.options.some(option => option.optionNumber === optionNumber);
    if (!isValidOption) {
      throw new Error('Invalid option number');
    }

    record.answers[orderInSet - 1] = optionNumber;
    record.progress = Math.max(record.progress, orderInSet);
    record.completed = record.progress === record.answers.length;

    await record.save();
    return record;
  }

  async getRecord(userId: string, quizSetId: string): Promise<IUserAnswerRecord | null> {
    return UserAnswerRecord.findOne({ userId, quizSetId });
  }

  async resetRecord(userId: string, quizSetId: string): Promise<IUserAnswerRecord> {
    const quizSet = await QuizSet.findOne({ quizSetId });
    if (!quizSet) {
      throw new Error('Quiz set not found');
    }

    const record = await UserAnswerRecord.findOneAndUpdate(
      { userId, quizSetId },
      {
        answers: new Array(quizSet.totalQuestions).fill(''),
        progress: 0,
        completed: false
      },
      { new: true, upsert: true }
    );

    return record;
  }

  //获取用户答题进度
  async getUserProgress(userId: string, quizSetId: string): Promise<number> {
    console.log('getUserProgress called with:', { userId, quizSetId });
    const userRecord = await this.getRecord(userId, quizSetId);
    console.log('User record found:', userRecord);
    if (!userRecord) {
      console.log('No user record found, returning 0');
      return 0;
    }
    if (typeof userRecord.progress !== 'number' || isNaN(userRecord.progress)) {
      console.log('Invalid progress value:', userRecord.progress);
      return 0;
    }
    console.log('Returning progress:', userRecord.progress);
    return userRecord.progress;
  }

  //注释：获取相似路径的数量（待检查）
  async getSimilarPathsCount(userId: string, quizSetId: string): Promise<number> {
    const userRecord = await this.getRecord(userId, quizSetId);
    if (!userRecord) {
      return 0;
    }

    const answerPath = userRecord.answers.slice(0, userRecord.progress).join('');
    const count = await UserAnswerRecord.countDocuments({
      quizSetId,
      answers: { $regex: `^${answerPath}` },
      progress: { $gte: userRecord.progress }
    });

    return count;
  }

  async getSummary(userId: string, quizSetId: string): Promise<{ quizTitle: string; answers: QuizAnswer[]; totalSimilarPaths: number }> {
    const record = await this.getRecord(userId, quizSetId);
    if (!record) {
      throw new Error('未找到答题记录');
    }

    const quizSet = await QuizSet.findOne({ quizSetId });
    if (!quizSet) {
      throw new Error('未找到题库');
    }

    const totalSimilarPaths = await this.getSimilarPathsCount(userId, quizSetId);

    const answers: QuizAnswer[] = record.answers.map((answer, index) => ({
      questionNumber: index + 1,
      userAnswer: answer
    }));

    return {
      quizTitle: quizSet.title,
      answers,
      totalSimilarPaths
    };
  }
}

export default UserAnswerRecordService;
