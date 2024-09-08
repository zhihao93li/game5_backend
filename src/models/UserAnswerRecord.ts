import mongoose, { Schema, Document } from 'mongoose';

export interface IUserAnswerRecord extends Document {
  _id: mongoose.Types.ObjectId;
  recordId: string;
  userId: string;
  quizSetId: string;
  progress: number;
  answers: string[];
  completed: boolean;
}

const UserAnswerRecordSchema: Schema = new Schema({
  recordId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  quizSetId: { type: String, required: true },
  progress: { type: Number, required: true, default: 0 },
  answers: { 
    type: [String], 
    default: [], 
    validate: [answersLengthValidator, 'Answers array length must match totalQuestions']
  },
  completed: { type: Boolean, required: true, default: false }
}, { timestamps: true });

async function answersLengthValidator(this: any, answers: string[]) {
  const QuizSet = mongoose.model('QuizSet');
  const quizSet = await QuizSet.findOne({ quizSetId: this.quizSetId });
  return answers.length === quizSet.totalQuestions;
}

export default mongoose.model<IUserAnswerRecord>('UserAnswerRecord', UserAnswerRecordSchema);
