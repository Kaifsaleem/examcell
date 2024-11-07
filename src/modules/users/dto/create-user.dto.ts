import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  //  IsPhoneNumber,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { UserType, UserTypes } from '../../../common/types';

export class CreateUserDto {
  // The unique identifier for the user. Marked as read-only as it should not be modified directly.
  @ApiProperty({
    readOnly: true, // This property cannot be altered by the client
  })
  readonly _id: string;

  // The first name of the user, which is required and must be at least 3 characters long.
  @ApiProperty({
    minLength: 3, // API documentation: min length for first name is 3 characters
  })
  @MinLength(3, {
    message: 'Name must be at least 3 characters long', // Validation error message
  })
  firstName: string;

  // The last name of the user, which is optional and doesn't have validation rules.
  @ApiProperty({
    required: false, // API documentation: this field is optional
  })
  @IsOptional() // Validation decorator: this field can be omitted
  lastName: string;

  // The user's email address, which must be valid and follow a proper email format.
  @ApiProperty({
    format: 'email', // API documentation: specifies that the format should be an email
  })
  @IsEmail(
    {},
    {
      message: 'Please provide a valid email address', // Validation error message
    },
  )
  email: string;

  // Uncomment the following lines if phone number validation is required.
  // The phone number must follow a specific pattern for Indian numbers (starting with +91).
  // @ApiProperty({
  //   pattern: `^\\+91[1-9]{1}[0-9]{9}$`,  // API documentation: Indian phone number format
  // })
  // @IsPhoneNumber(null, {
  //   message: 'Please provide a valid Phone Number',  // Validation error message
  // })
  // readonly phone: string;

  // The user type, which can be one of the available `UserTypes` except for `SUPER_ADMIN`.
  // The default value is set to `USER`.
  @ApiProperty({
    example: 'STUDENT',
    required: true, // Default value is USER
  })
  @IsEnum(UserTypes, {
    message: 'Invalid user type', // Validation error message if the type is incorrect
  })
  type: UserType;

  // The password for the user, which must be at least 6 characters long and is write-only.
  @ApiProperty({
    minLength: 6, // API documentation: password must be at least 6 characters
    writeOnly: true, // Password should not be returned in API responses
  })
  @MinLength(6, {
    message: 'Password is too short', // Validation error message
  })
  password: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString()
  instituteId: string;
}
// Student DTO
export class StudentDto extends CreateUserDto {
  // constructor(user: any) {
  //   super();
  //   this.firstName = user.firstName;
  //   this.lastName = user.lastName;
  //   this.email = user.email;
  //   this.type = user.type;
  //   this.course = user.course;
  //   this.yearOfStudy = user.yearOfStudy;
  //   this.exams = user.exams;
  // }
  @ApiPropertyOptional({ description: 'Course name (for students only)' })
  @IsOptional()
  @IsString()
  course?: string;

  @ApiPropertyOptional({ description: 'Institute Id (for students )' })
  @IsOptional()
  @IsString()
  instituteId: string;
  @ApiPropertyOptional({ description: 'Year of study (for students only)' })
  @IsOptional()
  @IsNumber()
  yearOfStudy?: number;

  @ApiPropertyOptional({
    description: 'List of exams for the student with status',
  })
  @IsOptional()
  @IsArray()
  exams?: {
    examId: Types.ObjectId;
    status: 'pending' | 'completed' | 'failed';
  }[];
}

// Teacher DTO
export class TeacherDto extends CreateUserDto {
  //  constructor(user: any) {
  //   super();
  //   this.firstName = user.firstName;
  //   this.lastName = user.lastName;
  //   this.email = user.email;
  //   this.type = user.type;
  //   this.department = user.department;
  //   this.examsAssigned = user.examsAssigned;
  // }
  @ApiPropertyOptional({
    description: 'Department or subject of the teacher (for teachers only)',
  })
  @IsOptional()
  @IsString()
  department?: string;
  @ApiPropertyOptional({ description: 'Institute ID(for teacher)' })
  @IsOptional()
  @IsString()
  instituteId: string;

  @ApiPropertyOptional({ description: 'Exams assigned to the teacher' })
  @IsOptional()
  @IsArray()
  examsAssigned?: { examId: Types.ObjectId; dateAssigned: Date }[];
}

// Institute DTO
export class InstituteDto extends CreateUserDto {
  //  constructor(user: any) {
  //   // super();
  //   // this.firstName = user.firstName;
  //   // this.lastName = user.lastName;
  //   // this.email = user.email;
  //   // this.type = user.type;
  //   // this.address = user.address;
  //   //  this.contactNumber = user.contactNumber;
  //   //  this.teachers = user.teachers;
  //   //  this.students = user.students;
  // }
  @ApiPropertyOptional({
    description: 'Institute address (for institutes only)',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Institute Code (for institutes only)' })
  @IsOptional()
  @IsString()
  instituteCode?: string;

  @ApiPropertyOptional({
    description: 'Contact number of the institute (for institutes only)',
  })
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @ApiPropertyOptional({
    description: 'List of teachers associated with the institute',
    example: '[]',
  })
  @IsOptional()
  @IsArray()
  teachers?: Types.ObjectId[];

  @ApiPropertyOptional({
    description: 'List of students associated with the institute',
    example: '[]',
  })
  @IsOptional()
  @IsArray()
  students?: Types.ObjectId[];
}
