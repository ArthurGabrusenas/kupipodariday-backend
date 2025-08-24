import {
  Body,
  Controller,
  Post,
  UseGuards,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiTags,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SigninUserResponseDto } from './dto/signin-user-response.dto';
import { SignupUserResponseDto } from './dto/signup-user-response.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@ApiTags('auth')
@ApiExtraModels(SigninUserResponseDto)
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiCreatedResponse({ type: SigninUserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Некорректная пара логин и пароль' })
  async signin(@Body() body: SigninDto) {
    const user = await this.usersService.findOne({ username: body.username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login({ id: user.id, username: user.username });
  }

  @Post('signup')
  @ApiCreatedResponse({ type: SignupUserResponseDto })
  @ApiConflictResponse({
    description: 'Пользователь с таким email или username уже зарегистрирован',
  })
  async signup(@Body() body: SignupDto) {
    try {
      const existing = await this.usersService.findByEmailOrUsername(
        body.email,
        body.username,
      );
      if (existing) {
        throw new ConflictException(
          'Пользователь с таким email или username уже зарегистрирован',
        );
      }
      const password = await this.hashService.hash(body.password);
      const user = await this.usersService.create({
        email: body.email,
        password,
        username: body.username,
        avatar: body.avatar,
        about: body.about,
      });
      return {
        id: user.id,
        username: user.username,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (err: any) {
      if (
        err &&
        typeof err === 'object' &&
        'code' in err &&
        err.code === '23505'
      ) {
        throw new ConflictException(
          'Пользователь с таким email или username уже зарегистрирован',
        );
      }
      throw err;
    }
  }
}
