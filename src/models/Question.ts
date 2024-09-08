import mongoose, { Schema, Document } from 'mongoose';

export interface IOption {
  optionNumber: string;
  content: string;
}

export interface IQuestion extends Document {
  questionId: string;
  quizSetId: string;
  orderInSet: number;
  content: string;
  options: IOption[];
}

const OptionSchema: Schema = new Schema({
  optionNumber: { type: String, required: true },
  content: { type: String, required: true }
});

const QuestionSchema: Schema = new Schema({
  questionId: { type: String, required: true, unique: true },
  quizSetId: { type: String, required: true },
  orderInSet: { type: Number, required: true },
  content: { type: String, required: true },
  options: { 
    type: [OptionSchema], 
    required: true, 
    validate: [arrayLimit, '{PATH} must have exactly 2 elements'] 
  }
}, { timestamps: true });

function arrayLimit(val: IOption[]) {
  return val.length === 2;
}

export default mongoose.model<IQuestion>('Question', QuestionSchema);