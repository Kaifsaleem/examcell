import { Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  InstituteDto,
  StudentDto,
  TeacherDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
// import { UserType, UserTypes } from '../../common/types';
import { User } from './users.schema';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createUser(
    UserDto: CreateUserDto | StudentDto | InstituteDto | TeacherDto,
  ): Promise<User> {
    const { email, type } = UserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Create the user based on type
    let user;
    switch (type) {
      case 'STUDENT': {
        const institute = await this.findByinstituteCode(UserDto.instituteId);
        if (!institute) {
          throw new BadRequestException('Institute not found');
        }
        user = new this.userModel({
          ...UserDto,
        });
        break;
      }

      case 'TEACHER': {
        //check instituteId is availavle as instituteCode
        const institute = await this.findByinstituteCode(UserDto.instituteId);
        if (!institute) {
          throw new BadRequestException('Institute not found');
        }

        user = new this.userModel({
          ...UserDto,
        });
        institute.teachers.push(user.id);
        await institute.save();
        break;
      }

      case 'INSTITUTE': {
        const randomThreeDigitNumber = Math.floor(100 + Math.random() * 900); // Generate a random 3-digit number
        const instituteCd = `${UserDto.firstName}-${randomThreeDigitNumber}`;
        const existinginstitute = await this.findByinstituteCode(instituteCd);
        if (existinginstitute) {
          throw new BadRequestException(
            'institute  with this instituteCode already exists',
          );
        }

        user = new this.userModel({
          ...UserDto,
          instituteCode: instituteCd,
        });

        break;
      }
      case 'ADMIN': {
        user = new this.userModel({
          ...UserDto,
        });
        break;
      }

      default:
        throw new BadRequestException('Invalid user type');
    }

    return user.save();
  }

  // async create(createUserDto: CreateUserDto) {
  //   const isEmailExist = await this.findByEmail(createUserDto.email);

  //   // TODO: Mabye we can create a custom decorator for this
  //   if (isEmailExist) {
  //     throw new ConflictException('Email already exists');
  //   }

  //   const user = new this.userModel(createUserDto);
  //   await user.save();

  //   this.eventEmitter.emit('user.create.success', user, createUserDto);
  //   return user.toObject();
  // }

  async findByinstituteCode(id: string) {
    return await this.userModel.findOne({ instituteCode: id });
  }
  async update(id: string, updateUserDto: UpdateUserDto, user: Express.User) {
    if (user.type !== 'ADMIN' && user.id !== id) {
      throw new Error('You are not authorized to update this user');
    }
    const existUser = await this.findById(id);
    existUser.set(updateUserDto);
    return existUser.toObject();
  }

  async findAll(user: Express.User) {
    // check user is admin
    if (user.type !== 'ADMIN') {
      throw new BadRequestException(
        'You are not authorized to perform this operation',
      );
    }
    const users = await this.userModel.find();
    return users;
    //    const users = await this.userModel.find();
    // return users.map(user => {
    //   switch (user.type) {
    //     case 'STUDENT':
    //       return new StudentDto();
    //     case 'TEACHER':
    //       return new TeacherDto(user);
    //     case 'INSTITUTE':
    //       return new InstituteDto(user);
    //     default:
    //       return user;

    //   }
    // });
  }

  async findOne(id: string, user: Express.User) {
    if (user.type !== 'ADMIN' && user.id !== id) {
      throw new Error('You are not authorized to view this user');
    }
    return this.findById(id);
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  async remove(id: string, user: Express.User) {
    if (user.type !== 'ADMIN') {
      throw new Error('You are not authorized to delete this user');
    }
    const existUser = await this.findById(id);
    if (!existUser) {
      throw new Error('User not found');
    }
    await this.userModel.deleteOne({ _id: id });
  }
}
