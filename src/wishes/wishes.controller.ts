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
  ApiTags,
  ApiExtraModels,
  ApiCreatedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { WishesService } from './wishes.service';
import { ForbiddenException } from '@nestjs/common';
import { AuthenticatedRequest } from '../types/authenticated-request';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishDto } from './dto/wish.dto';

@ApiTags('wishes')
@ApiExtraModels(WishDto, CreateWishDto)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('last')
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: { type: 'array', items: { $ref: getSchemaPath(WishDto) } },
      },
    },
  })
  getLast() {
    return this.wishesService.findMany({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  @Get('top')
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: { type: 'array', items: { $ref: getSchemaPath(WishDto) } },
      },
    },
  })
  getTop() {
    return this.wishesService.findMany({ order: { copied: 'DESC' }, take: 20 });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(WishDto) },
      },
    },
  })
  getOne(@Param('id') id: string) {
    return this.wishesService.findOne({ id: Number(id) });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(CreateWishDto) },
      },
    },
  })
  create(@Req() req: AuthenticatedRequest, @Body() body: CreateWishDto) {
    const price = Number(body.price).toFixed(2);
    return this.wishesService.create({
      ...body,
      price: Number(price),
      owner: { id: req.user.userId },
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  @ApiCreatedResponse({
    content: {
      'application/json': {
        schema: { type: 'object' },
      },
    },
  })
  async copy(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const wish = await this.wishesService.findOne({ id: Number(id) });
    const copy = await this.wishesService.create({
      name: wish!.name,
      link: wish!.link,
      image: wish!.image,
      price: wish!.price as number,
      description: wish!.description,
      owner: { id: req.user.userId } as unknown as any,
      copied: 0,
    });
    await this.wishesService.updateOne(
      { id: wish!.id },
      { copied: (wish!.copied || 0) + 1 },
    );
    return copy;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateWishDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const wish = await this.wishesService.findOne({ id: Number(id) });
    if (!wish || wish.owner.id !== req.user.userId) {
      throw new ForbiddenException('Можно изменять только свои подарки');
    }
    const update: Partial<CreateWishDto & UpdateWishDto> = { ...body };
    if (update.price !== undefined) {
      update.price = Number(Number(update.price).toFixed(2));
    }
    return this.wishesService.updateOne({ id: Number(id) }, update);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(WishDto) },
      },
    },
  })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const wish = await this.wishesService.findOne({ id: Number(id) });
    if (!wish || wish.owner.id !== req.user.userId) {
      throw new ForbiddenException('Можно удалять только свои подарки');
    }
    return this.wishesService.removeOne({ id: Number(id) });
  }
}
