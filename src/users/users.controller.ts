import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiBody,
  ApiExtraModels,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthenticatedRequest } from '../types/authenticated-request';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { WishDto } from '../wishes/dto/wish.dto';
import { OfferDto } from '../offers/dto/offer.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UserWishesDto } from './dto/user-wishes.dto';

@ApiTags('users')
@ApiExtraModels(
  UserProfileResponseDto,
  UserPublicProfileResponseDto,
  WishDto,
  OfferDto,
  UserWishesDto,
)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserProfileResponseDto })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findOwn(@Req() req: AuthenticatedRequest) {
    return this.usersService.findOne({ id: req.user.userId }).then((u) => {
      if (!u) return null as unknown as UserProfileResponseDto;
      return {
        id: u.id,
        username: u.username,
        about: u.about,
        avatar: u.avatar,
        email: u.email,
        createdAt: u.createdAt as unknown as string,
        updatedAt: u.updatedAt as unknown as string,
      };
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: { type: 'array', items: { $ref: getSchemaPath(WishDto) } },
        example: [
          {
            id: 0,
            createdAt: '2025-08-17T15:00:20.979Z',
            updatedAt: '2025-08-17T15:00:20.979Z',
            name: 'string',
            link: 'string',
            image: 'string',
            price: 1,
            raised: 1,
            copied: 0,
            description: 'string',
            owner: {
              id: 5,
              username: 'user',
              about: 'Пока ничего не рассказал о себе',
              avatar: 'https://i.pravatar.cc/300',
              createdAt: '2025-08-17T15:00:20.979Z',
              updatedAt: '2025-08-17T15:00:20.979Z',
            },
            offers: [
              {
                id: 0,
                createdAt: '2025-08-17T15:00:20.979Z',
                updatedAt: '2025-08-17T15:00:20.979Z',
                item: 'string',
                amount: 0,
                hidden: true,
                user: {
                  id: 5,
                  username: 'user',
                  about: 'Пока ничего не рассказал о себе',
                  avatar: 'https://i.pravatar.cc/300',
                  email: 'user@yandex.ru',
                  createdAt: '2025-08-17T15:00:20.979Z',
                  updatedAt: '2025-08-17T15:00:20.979Z',
                  wishes: ['string'],
                  offers: ['string'],
                  wishlists: [
                    {
                      id: 0,
                      createdAt: '2025-08-17T15:00:20.979Z',
                      updatedAt: '2025-08-17T15:00:20.979Z',
                      name: 'string',
                      image: 'string',
                      owner: {
                        id: 5,
                        username: 'user',
                        about: 'Пока ничего не рассказал о себе',
                        avatar: 'https://i.pravatar.cc/300',
                        createdAt: '2025-08-17T15:00:20.979Z',
                        updatedAt: '2025-08-17T15:00:20.979Z',
                      },
                      items: [
                        {
                          id: 0,
                          createdAt: '2025-08-17T15:00:20.979Z',
                          updatedAt: '2025-08-17T15:00:20.979Z',
                          name: 'string',
                          link: 'string',
                          image: 'string',
                          price: 1,
                          raised: 1,
                          copied: 0,
                          description: 'string',
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
  })
  getOwnWishes(@Req() req: AuthenticatedRequest) {
    return this.usersService.getWishesByUserId(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':username')
  @ApiOkResponse({ type: UserPublicProfileResponseDto })
  getPublic(@Param('username') username: string) {
    return this.usersService.findPublicByUsername(username);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':username/wishes')
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { $ref: getSchemaPath(UserWishesDto) },
        },
        example: [
          {
            id: 0,
            createdAt: '2025-08-17T15:05:32.264Z',
            updatedAt: '2025-08-17T15:05:32.264Z',
            name: 'string',
            link: 'string',
            image: 'string',
            price: 1,
            raised: 1,
            copied: 0,
            description: 'string',
            offers: [
              {
                id: 0,
                createdAt: '2025-08-17T15:05:32.264Z',
                updatedAt: '2025-08-17T15:05:32.264Z',
                item: 'string',
                amount: 0,
                hidden: true,
                user: {
                  id: 5,
                  username: 'user',
                  about: 'Пока ничего не рассказал о себе',
                  avatar: 'https://i.pravatar.cc/300',
                  email: 'user@yandex.ru',
                  createdAt: '2025-08-17T15:05:32.264Z',
                  updatedAt: '2025-08-17T15:05:32.264Z',
                  wishes: ['string'],
                  offers: ['string'],
                  wishlists: [
                    {
                      id: 0,
                      createdAt: '2025-08-17T15:05:32.264Z',
                      updatedAt: '2025-08-17T15:05:32.264Z',
                      name: 'string',
                      image: 'string',
                      owner: {
                        id: 5,
                        username: 'user',
                        about: 'Пока ничего не рассказал о себе',
                        avatar: 'https://i.pravatar.cc/300',
                        createdAt: '2025-08-17T15:05:32.264Z',
                        updatedAt: '2025-08-17T15:05:32.264Z',
                      },
                      items: [
                        {
                          id: 0,
                          createdAt: '2025-08-17T15:05:32.264Z',
                          updatedAt: '2025-08-17T15:05:32.264Z',
                          name: 'string',
                          link: 'string',
                          image: 'string',
                          price: 1,
                          raised: 1,
                          copied: 0,
                          description: 'string',
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
  })
  getUserWishes(@Param('username') username: string) {
    return this.usersService.getWishesByUsername(username);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('find')
  @ApiBody({
    schema: {
      $ref: getSchemaPath(FindUsersDto),
    },
    examples: {
      example: {
        value: { query: 'some@ya.ru' },
      },
    },
  })
  @ApiCreatedResponse({
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { $ref: getSchemaPath(UserProfileResponseDto) },
        },
        example: [
          {
            id: 5,
            username: 'user',
            about: 'Пока ничего не рассказал о себе',
            avatar: 'https://i.pravatar.cc/300',
            email: 'user@yandex.ru',
            createdAt: '2025-08-17T15:00:20.979Z',
            updatedAt: '2025-08-17T15:00:20.979Z',
          },
        ],
      },
    },
  })
  findMany(@Body() body: FindUsersDto) {
    return this.usersService.findMany({ search: body.query }).then((arr) =>
      arr.map((u) => ({
        id: u.id,
        username: u.username,
        about: u.about,
        avatar: u.avatar,
        email: u.email,
        createdAt: u.createdAt as unknown as string,
        updatedAt: u.updatedAt as unknown as string,
      })),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(UserProfileResponseDto) },
        example: {
          id: 5,
          username: 'user',
          about: 'Пока ничего не рассказал о себе',
          avatar: 'https://i.pravatar.cc/300',
          email: 'user@yandex.ru',
          createdAt: '2025-08-17T15:00:20.979Z',
          updatedAt: '2025-08-17T15:00:20.979Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Ошибка валидации переданных значений',
  })
  updateMe(@Req() req: AuthenticatedRequest, @Body() body: UpdateUserDto) {
    const userId = req.user?.userId;
    return this.usersService.updateProfileWithHashing(userId, body);
  }
}
