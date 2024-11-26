import {
  Controller,
  Get,
  // Post,
  Body,
  Param,
  Delete,
  Request,
  Put,
  Query,
} from '@nestjs/common';
// import { Request as ExRequest } from 'express';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './exam.schema';
import CtmAuth from '../../common/decorators/auth.decorator';
import { Request as ExRequest } from 'express';
import {
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  // ApiCreatedResponse,
} from '@nestjs/swagger';
import CtmPost from 'src/common/decorators/post.decorator';
import { GetExamDto } from './dto/get-exam.dto';

@Controller('exams')
@ApiTags('Exams')
@CtmAuth()
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  // Create a new exam
  @CtmPost('create')
  @ApiOkResponse({
    status: 201,
    description: 'Exam created successfully.',
    type: CreateExamDto,
  })
  create(@Body() createExamDto: CreateExamDto, @Request() req: ExRequest) {
    const user = req.auth.user;
    return this.examService.create(user, createExamDto);
  }

  // Get all exams
  @Get()
  @ApiOkResponse({
    status: 200,
    description: 'Exams retrieved successfully.',
    type: GetExamDto,
  })
  findAll(@Request() req: ExRequest): Promise<Exam[]> {
    const user = req.auth.user;
    return this.examService.findAll(user);
  }

  @Get('Qusetionpaper')
  @ApiQuery({ name: 'examId', required: true, type: String })
  async findQuestionPaper(
    @Query('examId') examId: string,
    @Request() req: ExRequest,
  ) {
    const user = req.auth.user;
    return this.examService.findExamQuestions(examId, user);
  }

  // // Get a single exam by ID
  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<Exam> {
  //   return this.examService.findOne(id);
  // }

  // Update an existing exam
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateExamDto: UpdateExamDto,
  ): Promise<Exam> {
    return this.examService.update(id, updateExamDto);
  }

  // Delete an exam by ID
  @Delete(':id')
  remove(@Param('id') id: string): Promise<any> {
    return this.examService.remove(id);
    
  }
}
