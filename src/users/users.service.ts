import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { messages } from '.././common/messages';
import { DatabaseService } from '.././database/database.service';

const sqlParams = {
  db_name: 'users',
};

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    const result = await this.databaseService.findAll({ ...sqlParams });
    return result;
  }

  async findOneByUsername(username: string): Promise<any> {
    const result = await this.databaseService.findAllByFieldName({
      ...sqlParams,
      field_names: ['username'],
      field_values: [username],
    });

    return result;
  }

  async findById(id: string): Promise<any> {
    const result = await this.databaseService.findAllByFieldName({
      ...sqlParams,
      field_names: ['id'],
      field_values: [id],
    });
    return result;
  }

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const { password } = createUserDto;

    try {
      const saltRounds = process.env.SALT_ROUNDS;
      createUserDto.password = await bcrypt.hash(password, +saltRounds);

      const result = await this.databaseService.insert({
        ...sqlParams,
        field_names: Object.keys(createUserDto),
        field_values: Object.values(createUserDto),
      });

      return result;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(messages.USER_EXIST);
      }
      throw new InternalServerErrorException(messages.DATABASE_ERROR);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(messages.USER_NOT_FOUND);
    }

    const result = await this.databaseService.update(id, {
      ...sqlParams,
      field_names: Object.keys(updateUserDto),
      field_values: Object.values(updateUserDto),
    });

    return result;
  }

  async removeUser(id: string): Promise<any> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(messages.USER_NOT_FOUND);
    }

    const result = await this.databaseService.delete({
      ...sqlParams,
      field_names: ['id'],
      field_values: [id],
    });

    return result;
  }
}
