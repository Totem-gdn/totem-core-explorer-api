import { Module } from '@nestjs/common';

import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { ExplorerBackendModule } from '../explorer-backend/explorer-backend.module';

@Module({
  imports: [ExplorerBackendModule],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}
