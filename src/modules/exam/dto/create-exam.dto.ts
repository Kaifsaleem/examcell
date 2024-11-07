import { IsString, IsDate, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Question } from '../exam.schema'; // Importing the Question class

export class CreateExamDto {
  @ApiProperty({ description: 'Title of the exam', example: 'Math Final Exam' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Subject of the exam', example: 'Mathematics' })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Date of the exam',
    type: String,
    example: '2024-12-10T10:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    description: 'Time of the exam (e.g., 10:00 AM)',
    example: '10:00 AM',
  })
  @IsString()
  time: string;

  @ApiProperty({
    description: 'Duration of the exam in minutes',
    example: 90,
    required: false,
  })
  @IsOptional()
  duration: number; // Duration in minutes

  @ApiProperty({
    description:
      'List of students assigned to the exam by their email addresses',
    type: [String],
    // example: ['student1@example.com', 'student2@example.com'],
  })
  @IsArray()
  assignedStudents: Types.ObjectId[];

  @ApiProperty({
    description: 'Array of questions for the exam',
    type: [Question],
    example: [
      {
        questionText: 'What is 2 + 2?',
        questionType: 'MCQ',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
      },
      {
        questionText: 'Explain the Pythagorean theorem.',
        questionType: 'TEXT',
        correctAnswer:
          'In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.',
      },
    ],
  })
  @IsArray()
  questions: Question[];
}
