import { OfferType, City, Location, CityValidation, LocationValidation } from '../../../types/index.js';
import { Type } from 'class-transformer';
import {
  IsArray, IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.messages.js';
import { GoodsEnum, OfferTypeEnum } from '../../../../consts.js';

export class CreateOfferDto {
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  @IsString({ message: CreateOfferValidationMessage.title.isString})
  public title: string;

  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  @IsString({ message: CreateOfferValidationMessage.description.isString})
  public description: string;

  @IsOptional()
  @IsDateString({strict: true}, { message: CreateOfferValidationMessage.publicDate.invalidFormat })
  public publicDate: Date;

  @ValidateNested()
  @Type(() => CityValidation)
  public city: City;

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsEnum(OfferTypeEnum, {message: CreateOfferValidationMessage.type.invalidFormat})
  public type: OfferType;

  @IsInt({ message: CreateOfferValidationMessage.room.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.room.minValue })
  @Max(8, { message: CreateOfferValidationMessage.room.maxValue })
  public room: number;

  @IsInt({ message: CreateOfferValidationMessage.bedroom.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.bedroom.minValue })
  @Max(10, { message: CreateOfferValidationMessage.bedroom.maxValue })
  public bedroom: number;

  @IsNumber({}, {message: CreateOfferValidationMessage.price.isNumber})
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.goods.invalidFormat })
  @IsString({each: true, message: CreateOfferValidationMessage.goods.isString})
  @IsEnum(GoodsEnum, {each: true, message: CreateOfferValidationMessage.goods.isEnum})
  public goods: string[];

  public hostId: string;

  @ValidateNested()
  @Type(() => LocationValidation)
  public location: Location;
}
