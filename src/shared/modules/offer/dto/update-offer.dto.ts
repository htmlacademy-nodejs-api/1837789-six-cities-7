import { OfferType, City, Location } from '../../../types/index.js';
import { CreateUpdateOfferMessage } from './update-offer.messages.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray, IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { GOODS, OFFER_TYPE } from '../../../../consts.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: CreateUpdateOfferMessage.title.minLength })
  @MaxLength(100, { message: CreateUpdateOfferMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(20, { message: CreateUpdateOfferMessage.description.minLength })
  @MaxLength(1024, { message: CreateUpdateOfferMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsOptional()
  @IsDateString({}, { message: CreateUpdateOfferMessage.publicDate.invalidFormat })
  public publicDate?: Date;

  @IsOptional()
  @ValidateNested()
  public city?: City;

  @IsOptional()
  @IsUrl(
    {},
    {
      message: CreateUpdateOfferMessage.previewImage.isUrl,
    },
  )
  @Matches(/\.(jpg|png)(\?.*)?$/i, {
    message: CreateUpdateOfferMessage.previewImage.matches,
  })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: CreateUpdateOfferMessage.images.invalidFormat })
  @ArrayMinSize(6, { message: CreateUpdateOfferMessage.images.ArrayMinSize })
  @ArrayMaxSize(6, { message: CreateUpdateOfferMessage.images.ArrayMaxSize })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: CreateUpdateOfferMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean({ message: CreateUpdateOfferMessage.isFavorite.invalidFormat })
  public isFavorite?: boolean;

  @IsOptional()
  @IsIn([OFFER_TYPE.House, OFFER_TYPE.Apartment, OFFER_TYPE.Hotel, OFFER_TYPE.Room], {
    message: CreateUpdateOfferMessage.type.invalidFormat,
  })
  public type?: OfferType;

  @IsOptional()
  @IsInt({ message: CreateUpdateOfferMessage.room.invalidFormat })
  @Min(1, { message: CreateUpdateOfferMessage.room.minValue })
  @Max(8, { message: CreateUpdateOfferMessage.room.maxValue })
  public room?: number;

  @IsOptional()
  @IsInt({ message: CreateUpdateOfferMessage.bedroom.invalidFormat })
  @Min(1, { message: CreateUpdateOfferMessage.bedroom.minValue })
  @Max(10, { message: CreateUpdateOfferMessage.bedroom.maxValue })
  public bedroom?: number;

  @IsOptional()
  @IsInt({ message: CreateUpdateOfferMessage.price.invalidFormat })
  @Min(100, { message: CreateUpdateOfferMessage.price.minValue })
  @Max(100000, { message: CreateUpdateOfferMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: CreateUpdateOfferMessage.goods.invalidFormat })
  @IsIn(
    [
      GOODS.Breakfast,
      GOODS.AirConditioning,
      GOODS.LaptopFriendlyWorkspace,
      GOODS.BabySeat,
      GOODS.Washer,
      GOODS.Towels,
      GOODS.Fridge,
    ],
    {
      each: true,
      message: CreateUpdateOfferMessage.goods.invalidFormat,
    },
  )
  public goods?: string[];

  @IsOptional()
  @IsMongoId({ message: CreateUpdateOfferMessage.hostId.invalidId })
  public hostId?: string;

  @IsOptional()
  @ValidateNested()
  public location?: Location;
}
