import { Body, Controller, Param, Post, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssetTypePipe } from '../../utils/pipes';
import { AssetType } from '../../utils/enums';
import { WithpaperService } from './withpaper.service';
import { CreatePaymentLinkRequestDto, CreatePaymentLinkResponseDto } from './dto/create-payment-link.dto';
import { ProcessWebhookRequestDto } from './dto/process-webhook.dto';

@ApiTags('Payments')
@Controller('payments') // FIXME: create root controller 'payments' and rename this controller to 'withpaper'
export class WithpaperController {
  constructor(private readonly service: WithpaperService) {}

  @Post('withpaper/:assetType/link')
  @ApiParam({ name: 'assetType', enum: ['avatar', 'item', 'gem'] })
  // @ApiHeader({ name: 'Authorization', required: true, description: 'Authorization token' })
  @ApiResponse({
    status: 200,
    description: 'API returns oder id and url for payment',
    type: CreatePaymentLinkResponseDto,
  })
  @ApiOperation({ summary: 'API for creating an order and a payment link for buying an asset' })
  async createPaymentLink(
    @Param('assetType', new AssetTypePipe()) assetType: AssetType,
    @Body(new ValidationPipe({ transform: true, stopAtFirstError: true })) body: CreatePaymentLinkRequestDto,
  ) {
    return await this.service.createPaymentLink(
      assetType,
      body.ownerAddress,
      body.successUrl,
      body.imageUrl,
      body.redirect,
    );
  }

  @Post('withpaper/webhook')
  @ApiResponse({
    status: 200,
  })
  @ApiOperation({ summary: 'API for process webhooks' })
  async processWebhook(
    @Body(new ValidationPipe({ transform: true, stopAtFirstError: true })) body: ProcessWebhookRequestDto,
  ): Promise<void> {
    await this.service.processWebhook(body.orderId, body.event, body.txHash);
  }
}
