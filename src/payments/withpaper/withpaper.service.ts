import { Injectable } from '@nestjs/common';

import { AssetType } from 'src/utils/enums';
import { WithpaperService as ExplorerPayments } from '../../explorer-backend/payments/withpaper/withpaper.service';

@Injectable()
export class WithpaperService {
  constructor(private paymentsService: ExplorerPayments) {}

  async createPaymentLink(
    assetType: AssetType,
    ownerAddress: string,
    successUrl: string,
    imageUrl: string,
    redirect: boolean,
  ) {
    return await this.paymentsService.createPaymentLink({
      assetType,
      ownerAddress,
      successUrl,
      imageUrl,
      redirect,
    });
  }

  async processWebhook(orderId: string, event: string, txHash: string) {
    return await this.paymentsService.processWebhook({
      orderId,
      event,
      txHash,
    });
  }
}
