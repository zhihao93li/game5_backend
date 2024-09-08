import { IQuizSet } from '../models/QuizSet';
import QuizSet from '../models/QuizSet';

export class QuizSetService {
  async getAllQuizSets(): Promise<IQuizSet[]> {
    return QuizSet.find();
  }

  async getQuizSetById(quizSetId: string): Promise<IQuizSet | null> {
    return QuizSet.findOne({ quizSetId });
  }

};

export default QuizSetService;
