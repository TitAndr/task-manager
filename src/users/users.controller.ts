import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Patch,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/services/auth.service';
import { messages } from '../common/messages';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Public() // allow to get all users list
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Public() // allow to create user
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;

    const user = await this.authService.validateUser(username, password);

    if (user) {
      throw new ConflictException(messages.USER_EXIST);
    }

    await this.usersService.createUser(createUserDto);
    return { message: messages.USER_CREATED };
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.removeUser(id);
  }
}
