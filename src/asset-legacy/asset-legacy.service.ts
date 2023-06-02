import { Injectable } from '@nestjs/common';
import { Long } from '@grpc/proto-loader';

import { CreateAssetRecordRequestDto, CreateAssetRecordResponseDto } from './dto/create-record.dto';
import { PaginatedDto } from '../utils/dto/paginated.dto';
import { AssetLegacyRecordDto } from './dto/legacy-record.dto';
import { AssetLegacyService as ExplorerAssetLegacy } from '../explorer-backend/asset-legacy/asset-legacy.service';
import { AssetType } from '../utils/enums';
import { FindAllFiltersDto } from './dto/find-all-filters.dto';

@Injectable()
export class AssetLegacyService {
  constructor(private assetsLegacyService: ExplorerAssetLegacy) {}

  async create(assetType: AssetType, record: CreateAssetRecordRequestDto): Promise<CreateAssetRecordResponseDto> {
    return await this.assetsLegacyService.create({ assetType, ...record });
  }

  async findAll(assetType: AssetType, filters: FindAllFiltersDto): Promise<PaginatedDto<AssetLegacyRecordDto>> {
    const {
      total,
      limit,
      offset,
      results = [],
    } = await this.assetsLegacyService.findAll({
      assetType,
      filters: {
        playerAddress: filters.playerAddress || '',
        assetId: filters.assetId || '',
        gameAddress: filters.gameAddress || '',
      },
      limit: Long.fromString(filters.limit),
      offset: Long.fromString(filters.offset),
    });
    return {
      total: total.toNumber(),
      limit: limit.toNumber(),
      offset: offset.toNumber(),
      results: results.map((record) => ({
        ...record,
        timestamp: record.timestamp.toNumber(),
      })),
    };
  }

  async findById(assetType: AssetType, recordId: string): Promise<AssetLegacyRecordDto> {
    const { record } = await this.assetsLegacyService.findById({ assetType, recordId });
    return {
      ...record,
      timestamp: record.timestamp.toNumber(),
    };
  }

  async statistics(gameAddress: string) {
    const results = await this.assetsLegacyService.gamesStatistics(gameAddress);

    return {
      ...results,
      avatars: results.avatars.toNumber(),
      items: results.items.toNumber(),
      users: results.users.toNumber(),
    };
  }
}
