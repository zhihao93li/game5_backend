import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizSet extends Document {
  quizSetId: string;
  title: string;
  description: string;
  totalQuestions: number;
}

const QuizSetSchema: Schema = new Schema({
  quizSetId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  totalQuestions: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model<IQuizSet>('QuizSet', QuizSetSchema);
