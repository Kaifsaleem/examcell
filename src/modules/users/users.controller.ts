import { Controller, Body } from '@nestjs/common';
import { Get, Patch, Param, Delete, Request } from '@nestjs/common';


import { UsersService } from './users.service';
import { CreateUserDto, StudentDto, TeacherDto, InstituteDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request as ExRequest } from 'express';
import CtmPost from '../../common/decorators/post.decorator';
import CtmAuth  from '../../common/decorators/auth.decorator';


@Controller('users')
@ApiTags('Users')
  
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @description Create a new user
   */
  // @ApiOkResponse({ description: 'Create a new user', type: CreateUserDto })
  // @CtmPost()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }
   @CtmPost()
  @ApiOkResponse({ status: 201, description: 'User created successfully.', type: CreateUserDto })
  @ApiOkResponse({ status: 400, description: 'Invalid data or user already exists.' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.usersService.createUser(createUserDto);
  }

  // Endpoint for creating a student
  @CtmPost('student')
  @ApiOkResponse({ status: 201, description: 'Student created successfully.', type: StudentDto })
  async createStudent(@Body() studentDto: StudentDto): Promise<StudentDto> {

    return this.usersService.createUser(studentDto);
  }

  // Endpoint for creating a teacher
  @CtmPost('teacher')
  @ApiOkResponse({ status: 201, description: 'Teacher created successfully.', type: TeacherDto })
  async createTeacher(@Body() teacherDto: TeacherDto): Promise<TeacherDto> {
    return this.usersService.createUser(teacherDto);
  }

  // Endpoint for creating an institute
  @CtmPost('institute')
  @ApiOkResponse({ status: 201, description: 'Institute created successfully.', type: InstituteDto })
  async createInstitute(@Body() instituteDto: InstituteDto): Promise<InstituteDto> {
    return this.usersService.createUser(instituteDto);
  }

  /**
   * @description Get user profile
   */
  // @ApiOkResponse({ description: 'Get user profile', type: CreateUserDto })
  // @Get('profile')
  // getProfile(@Request() req: ExRequest) {
    //   console.log(Object.keys(req));
    //   return this.usersService.findById(req.auth.user.id);
    // }
    
    /**
     * @description Get user profile
    */
   // @ApiOkResponse({ description: 'Get user profile', type: CreateUserDto })
   // @CtmAuth()
  // @Get('admin')
  // getProfileAdmin(@Request() req: ExRequest) {
  //   console.log('here');
  //   return this.usersService.findById(req.auth.user.id);
  // }

  @Get()
  @CtmAuth()
  findAll(@Request() req: ExRequest) {
    const user = req.auth.user;
    return this.usersService.findAll(user);
  }
  
  @Get(':id')
  @CtmAuth()
  findOne(@Param('id') id: string, @Request() req: ExRequest) {
    const user = req.auth.user;
    return this.usersService.findOne(id, user);
  }
  
  @Patch(':id')
  @CtmAuth()
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: ExRequest,
  ) {
    const user = req.auth?.user;
    return this.usersService.update(id, updateUserDto, user);
  }
  
  @Delete(':id')
  @CtmAuth()
  remove(@Param('id') id: string, @Request() req: ExRequest) {
    const user = req.auth?.user;
    return this.usersService.remove(id, user);
  }
}
