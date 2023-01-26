import { Body, Controller, Get, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { ValidAddressPipe } from '../utils/pipes/valid-address.pipe';
import { ApiPaginatedResponse, PaginatedDto } from '../utils/dto/paginated.dto';
import { GamesDirectoryService } from './games-directory.service';
import { CreateGameRequestDto, CreateGameResponseDto } from './dto/create-game.dto';
import { UpdateGameRequestDto, UpdateGameResponseDto } from './dto/update-game.dto';
import { GameRecordDto } from './dto/game-record.dto';
import { FindAllFiltersDto } from './dto/find-all-filters.dto';
import { legacyGamesIds } from '../utils/temp/legacyGamesMapping';

@ApiTags('Games Directory')
@ApiExtraModels(PaginatedDto)
@ApiExtraModels(GameRecordDto)
@ApiExtraModels(CreateGameResponseDto)
@ApiExtraModels(UpdateGameResponseDto)
@Controller('games-directory')
export class GamesDirectoryController {
  constructor(private service: GamesDirectoryService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created successfully', schema: { $ref: getSchemaPath(CreateGameResponseDto) } })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  async create(
    @Body(new ValidationPipe({ transform: true, stopAtFirstError: true })) request: CreateGameRequestDto,
  ): Promise<CreateGameResponseDto> {
    return await this.service.create(request);
  }

  @Patch(':address')
  @ApiOkResponse({
    description: 'Updated successfully, returning transaction hashes of the updated fields only',
    schema: { $ref: getSchemaPath(UpdateGameResponseDto) },
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  async update(
    @Param('address', new ValidAddressPipe()) address: string,
    @Body(new ValidationPipe({ transform: true, stopAtFirstError: true })) updateGameDto: UpdateGameRequestDto,
  ): Promise<UpdateGameResponseDto> {
    return await this.service.update(address, updateGameDto);
  }

  @Get()
  @ApiPaginatedResponse(GameRecordDto, { description: 'Paginated list of the games' })
  async findAll(
    @Query(new ValidationPipe({ transform: true, stopAtFirstError: true })) filters: FindAllFiltersDto,
  ): Promise<PaginatedDto<GameRecordDto>> {
    const res = await this.service.findAll(filters);
    res.results.map((game) => {
      if (Object.keys(legacyGamesIds).includes(game.gameAddress)) {
        game.gameAddress = legacyGamesIds[game.gameAddress];
      }
    });
    return res;
  }

  @Get(':address')
  @ApiOkResponse({
    schema: { $ref: getSchemaPath(GameRecordDto) },
    description: 'Game record',
  })
  async findByAddress(@Param('address', new ValidAddressPipe()) address: string): Promise<GameRecordDto> {
    const res = await this.service.findByAddress(address);
    if (Object.keys(legacyGamesIds).includes(res.gameAddress)) {
      res.gameAddress = legacyGamesIds[res.gameAddress];
    }
    return res;
  }
}
