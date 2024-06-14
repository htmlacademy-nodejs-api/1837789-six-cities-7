import { OfferType, City, Location, CityValidation, LocationValidation } from '../../../types/index.js';
import { CreateUpdateOfferMessage } from './update-offer.messages.js';
import { Type } from 'class-transformer';
import {
  IsArray, IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
  IsString,
  IsNumber
} from 'class-validator';
import { GoodsEnum, OfferTypeEnum} from '../../../../consts.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: CreateUpdateOfferMessage.title.minLength })
  @MaxLength(100, { message: CreateUpdateOfferMessage.title.maxLength })
  @IsString({ message: CreateUpdateOfferMessage.title.isString})
  public title?: string;

  @IsOptional()
  @MinLength(20, { message: CreateUpdateOfferMessage.description.minLength })
  @MaxLength(1024, { message: CreateUpdateOfferMessage.description.maxLength })
  @IsString({ message: CreateUpdateOfferMessage.description.isString})
  public description?: string;

  @IsOptional()
  @IsDateString({strict: true}, { message: CreateUpdateOfferMessage.publicDate.invalidFormat })
  public publicDate?: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => CityValidation)
  public city?: City;

  @IsOptional()
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: CreateUpdateOfferMessage.images.invalidFormat })
  @IsString({each: true, message: CreateUpdateOfferMessage.images.isString})
  @IsUrl({}, {each: true, message: CreateUpdateOfferMessage.images.isUrl })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: CreateUpdateOfferMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean({ message: CreateUpdateOfferMessage.isFavorite.invalidFormat })
  public isFavorite?: boolean;

  @IsOptional()
  @IsEnum(OfferTypeEnum, {message: CreateUpdateOfferMessage.type.invalidFormat})
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
  @IsNumber({}, {message: CreateUpdateOfferMessage.price.isNumber})
  @Min(100, { message: CreateUpdateOfferMessage.price.minValue })
  @Max(100000, { message: CreateUpdateOfferMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: CreateUpdateOfferMessage.goods.invalidFormat })
  @IsEnum(GoodsEnum, {each: true, message: CreateUpdateOfferMessage.goods.isEnum})
  public goods?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationValidation)
  public location?: Location;
}
