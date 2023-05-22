import { Body, Controller, Get, Param, Post, Query, UseFilters, ValidationPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { AssetLegacyService } from './asset-legacy.service';
import { ApiPaginatedResponse, PaginatedDto } from '../utils/dto/paginated.dto';
import { UnhandledExceptionFilter } from '../utils/filters';
import { CreateAssetRecordRequestDto, CreateAssetRecordResponseDto } from './dto/create-record.dto';
import { AssetLegacyRecordDto } from './dto/legacy-record.dto';
import { FindAllFiltersDto } from './dto/find-all-filters.dto';
import { AssetType } from '../utils/enums';
import { AssetTypePipe } from '../utils/pipes';
import { legacyGamesAddresses, legacyGamesIds } from '../utils/temp/legacyGamesMapping';

@ApiTags('Assets Legacy')
@ApiExtraModels(PaginatedDto)
@ApiExtraModels(AssetLegacyRecordDto)
@ApiExtraModels(CreateAssetRecordRequestDto)
@ApiExtraModels(CreateAssetRecordResponseDto)
@ApiExtraModels(FindAllFiltersDto)
@Controller('asset-legacy')
@UseFilters(new UnhandledExceptionFilter())
export class AssetLegacyController {
  constructor(private service: AssetLegacyService) {}

  @Get('statistics/:gameAddress')
  @ApiOkResponse({
    description: 'Count of items and avatars used in game',
  })
  async statistics(@Param('gameAddress') gameAddress: string) {
    return await this.service.statistics(gameAddress);
  }

  @Post(':assetType')
  @ApiParam({ name: 'assetType', enum: ['avatar', 'item', 'gem'] })
  @ApiCreatedResponse({
    description: 'Created successfully',
    schema: { $ref: getSchemaPath(CreateAssetRecordResponseDto) },
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  async create(
    @Param('assetType', new AssetTypePipe()) assetType: AssetType,
    @Body(new ValidationPipe({ transform: true, stopAtFirstError: true })) request: CreateAssetRecordRequestDto,
  ): Promise<CreateAssetRecordResponseDto> {
    if (Object.keys(legacyGamesAddresses).includes(request.gameAddress)) {
      request.gameAddress = legacyGamesAddresses[request.gameAddress];
    }
    return await this.service.create(assetType, request);
  }

  @Get(':assetType')
  @ApiParam({ name: 'assetType', enum: ['avatar', 'item', 'gem'] })
  @ApiPaginatedResponse(AssetLegacyRecordDto, {
    description: 'Paginated list of the asset legacy records',
  })
  async findAll(
    @Param('assetType', new AssetTypePipe()) assetType: AssetType,
    @Query(new ValidationPipe({ transform: true, stopAtFirstError: true })) filters: FindAllFiltersDto,
  ): Promise<PaginatedDto<AssetLegacyRecordDto>> {
    if (filters.gameAddress && Object.keys(legacyGamesAddresses).includes(filters.gameAddress)) {
      filters.gameAddress = legacyGamesAddresses[filters.gameAddress];
      const res = await this.service.findAll(assetType, filters);
      res.results.map((game) => {
        if (Object.keys(legacyGamesIds).includes(game.gameAddress)) {
          game.gameAddress = legacyGamesIds[game.gameAddress];
        }
      });
      return res;
    }
    return await this.service.findAll(assetType, filters);
  }

  @Get(':assetType/:id')
  @ApiParam({ name: 'assetType', enum: ['avatar', 'item', 'gem'] })
  @ApiOkResponse({
    description: 'Asset legacy record',
    schema: { $ref: getSchemaPath(AssetLegacyRecordDto) },
  })
  async findById(
    @Param('assetType', new AssetTypePipe()) assetType: AssetType,
    @Param('id') id: string,
  ): Promise<AssetLegacyRecordDto> {
    const res = await this.service.findById(assetType, id);
    if (Object.keys(legacyGamesIds).includes(res.gameAddress)) {
      res.gameAddress = legacyGamesIds[res.gameAddress];
    }
    return res;
  }
}
