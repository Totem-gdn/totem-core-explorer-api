import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsValidAddress } from 'src/utils/validations/IsValidAddress';

export class CreatePaymentLinkRequestDto {
  @ApiProperty({ description: 'owner address', required: true })
  @IsValidAddress()
  @IsNotEmpty()
  ownerAddress: string;

  @ApiProperty({ description: 'asset preview image url', required: false })
  imageUrl: string;

  @ApiProperty({
    description: 'the address to which the client will be redirected after successful payment',
    required: false,
  })
  successUrl: string;

  @ApiProperty({
    description: 'If true then you will be redirected after payment',
  })
  redirect: boolean;
}

export class CreatePaymentLinkResponseDto {
  @ApiProperty({ description: 'created order id' })
  orderId: string;

  @ApiProperty({ description: 'link to pay with "Withpaper"' })
  url: string;
}
