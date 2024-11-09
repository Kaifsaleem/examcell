import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
// import { Question } from '../exam.schema';
import { CreateExamDto } from './create-exam.dto';

export class GetExamDto extends CreateExamDto {
  @ApiProperty({
    description: 'Unique identifier for the exam',
    example: '647f1fbcf1d292c9b9cfc123',
  })
  _id: Types.ObjectId;
  @ApiProperty({
    description: 'Teacher ID who created the exam',
    example: '647f1fbcf1d292c9b9cfb123',
  })
  teacherId: Types.ObjectId;

  @ApiProperty({
    description: 'Timestamp when the exam was created',
    example: '2024-12-01T08:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the exam was last updated',
    example: '2024-12-05T10:00:00.000Z',
  })
  updatedAt: Date;
}
