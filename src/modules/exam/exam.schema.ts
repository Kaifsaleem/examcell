import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import CtmSchema from '../../common/decorators/schema.decorator';
import { Document } from '../../common/schema/document.schema';

enum QuestionType {
  MCQ = 'MCQ',
  TEXT = 'TEXT',
  BOTH = 'BOTH',
}
export class Question {
  @Prop({ required: true })
  questionText: string; // The text of the question

  @Prop({ required: true })
  questionType: QuestionType; // Type of the question (MCQ or Written)

  @Prop({ type: [String], required: false })
  options?: string[]; // Options for MCQ questions, not required for Written

  @Prop({ required: false })
  correctAnswer?: string; // Correct answer for written questions, if applicable
}
@CtmSchema()
export class Exam extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  duration: number; // Duration in minutes

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  teacherId: Types.ObjectId; // Reference to Teacher

  @Prop({ type: Types.ObjectId, ref: 'User' })
  instituteId: Types.ObjectId; // Reference to Institute

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  assignedStudents: Types.ObjectId[]; // References to Students

  @Prop({ type: [Question], required: true })
  questions: Question[]; // Array of questions
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
