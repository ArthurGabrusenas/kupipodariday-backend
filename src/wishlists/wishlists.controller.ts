import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { ForbiddenException } from '@nestjs/common';
import { AuthenticatedRequest } from '../types/authenticated-request';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistDto } from './dto/wishlist.dto';

@ApiTags('wishlistlists')
@ApiExtraModels(WishlistDto)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: { type: 'array', items: { $ref: getSchemaPath(WishlistDto) } },
      },
    },
  })
  findAll() {
    return this.wishlistsService.findMany();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(WishlistDto) },
      },
    },
  })
  getOne(@Param('id') id: string) {
    return this.wishlistsService.findOneWithRelations({ id: Number(id) });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(WishlistDto) },
      },
    },
  })
  create(@Req() req: AuthenticatedRequest, @Body() body: CreateWishlistDto) {
    return this.wishlistsService.createFromDto(body, req.user?.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(WishlistDto) },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateWishlistDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const list = await this.wishlistsService.findOne({ id: Number(id) });
    if (!list || list.owner.id !== req.user.userId) {
      throw new ForbiddenException('Можно изменять только свои подборки');
    }
    await this.wishlistsService.updateFromDto(Number(id), body);
    return this.wishlistsService.findOneWithRelations({ id: Number(id) });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(WishlistDto) },
      },
    },
  })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const list = await this.wishlistsService.findOne({ id: Number(id) });
    if (!list || list.owner.id !== req.user.userId) {
      throw new ForbiddenException('Можно удалять только свои подборки');
    }
    return this.wishlistsService.removeOne({ id: Number(id) });
  }
}
