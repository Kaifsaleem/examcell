import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exam } from './exam.schema';
import { Types } from 'mongoose';
import { CreateExamDto } from './dto/create-exam.dto'; // DTO for creating an exam
import { UpdateExamDto } from './dto/update-exam.dto'; // DTO for updating an exam

@Injectable()
export class ExamService {
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<Exam>,
    @InjectModel('User') private readonly userModel: Model<any>,
  ) {}

  // Create a new exam
  async create(user: Express.User, createExamDto: CreateExamDto) {
    if (user.type !== 'TEACHER') {
      throw new BadRequestException('Only teachers can create exams');
    }
    const createdExam = new this.examModel({
      ...createExamDto,
      teacherId: user.id,
      instituteId: user.instituteId,
    });
    // add exam id to all assigned students's eschema in xaam array
    const savedExam = await createdExam.save();

    // Step 2: Update assigned students to add the exam ID in their exams array
    const assignedStudents = createExamDto.assignedStudents; // Array of student IDs/emails
    console.log(assignedStudents);
    await this.userModel.updateMany(
      { _id: { $in: assignedStudents } },
      {
        $push: {
          exams: { examId: savedExam._id, status: 'pending' },
        },
      },
    );

    return savedExam;
  }

  // Find all exams
  async findAll(user: Express.User): Promise<Exam[]> {
    if (user.type === 'TEACHER') {
      return this.examModel
        .find({ teacherId: user.id })
        .populate('assignedStudents teacherId')
        .exec();
    } else if (user.type === 'INSTITUTE') {
      return this.examModel
        .find({ instituteId: user.instituteId })
        .populate('assignedStudents teacherId')
        .exec();
    } else if (user.type === 'ADMIN') {
      return this.examModel
        .find()
        .populate('assignedStudents teacherId')
        .exec();
    } else {
      throw new Error('Only teachers can view exams');
    }
  }

  // Find a single exam by ID
  async findOne(id: string): Promise<Exam> {
    return this.examModel
      .findById(id)
      .populate('assignedStudents teacherId')
      .exec();
  }
  async findExamQuestions(examId: string, user: Express.User) {
    const objectId = new Types.ObjectId(examId);
    // check if user id is in assigned student for exam or not
    const userRecord = await this.userModel
      .findOne({ _id: user.id })
      .populate('exams');

    const isUserAssigned = userRecord.exams.some(
      (exam) => exam.examId.toString() === examId,
    );

    if (!isUserAssigned) {
      throw new ForbiddenException('User is not assigned to this exam');
    }
    const result = await this.examModel.aggregate([
      // Match the specific exam by ID
      { $match: { _id: objectId } },
      // Project only the necessary fields, excluding answer fields
      {
        $project: {
          title: 1,
          subject: 1,
          date: 1,
          time: 1,
          duration: 1,
          questions: {
            questionText: 1,
            questionType: 1,
            options: 1, // Include options only for MCQ type questions
          },
        },
      },
    ]);

    if (!result || result.length === 0) {
      throw new NotFoundException('Exam not found');
    }

    return result[0]; // Return the first result as we matched by ID
  }

  // Update an existing exam by ID
  async update(id: string, updateExamDto: UpdateExamDto): Promise<Exam> {
    return this.examModel
      .findByIdAndUpdate(id, updateExamDto, { new: true })
      .exec();
  }

  // Delete an exam by ID
  async remove(id: string): Promise<any> {
    return this.examModel.findByIdAndDelete(id).exec();
  }
}
