import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { ExplorerProvider } from '../explorer-backend.constants';
import {
  AssetLegacy,
  CreateAssetLegacyRequest,
  CreateAssetLegacyResponse,
  FindAllRequest,
  FindAllResponse,
  FindByIdRequest,
  FindByIdResponse,
} from './asset-legacy.interface';

@Injectable()
export class AssetLegacyService implements OnModuleInit {
  private service: AssetLegacy;

  constructor(@Inject(ExplorerProvider) private client: ClientGrpc) {}

  onModuleInit() {
    this.service = this.client.getService<AssetLegacy>('AssetLegacy');
  }

  async create(request: CreateAssetLegacyRequest): Promise<CreateAssetLegacyResponse> {
    return await firstValueFrom<CreateAssetLegacyResponse>(this.service.Create(request));
  }

  async findAll(request: FindAllRequest): Promise<FindAllResponse> {
    return await firstValueFrom<FindAllResponse>(this.service.FindAll(request));
  }

  async findById(request: FindByIdRequest): Promise<FindByIdResponse> {
    return await firstValueFrom<FindByIdResponse>(this.service.FindById(request));
  }

  async gamesStatistics(gameAddress: string) {
    const data = await firstValueFrom(this.service.GamesStatistics({ gameAddress }));
    return data;
  }
}
