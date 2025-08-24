import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiBody,
  ApiOkResponse,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { AuthenticatedRequest } from '../types/authenticated-request';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferDto } from './dto/offer.dto';

@ApiTags('offers')
@ApiExtraModels(OfferDto)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({ required: true, type: CreateOfferDto })
  @ApiCreatedResponse({ schema: { type: 'object' } })
  create(@Req() req: AuthenticatedRequest, @Body() body: CreateOfferDto) {
    return this.offersService.create({ ...body, userId: req.user?.userId });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: { type: 'array', items: { $ref: getSchemaPath(OfferDto) } },
      },
    },
  })
  findAll() {
    return this.offersService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(OfferDto) },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(Number(id));
  }
}
