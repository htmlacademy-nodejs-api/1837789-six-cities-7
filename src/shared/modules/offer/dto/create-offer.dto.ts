import { OfferType, City, Location } from '../../../types/index.js';
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
import { CreateOfferValidationMessage } from './create-offer.messages.js';
import { GOODS, OFFER_TYPE, CITIES } from '../../../../consts.js';

export class CreateOfferDto {
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  public description: string;

  @IsOptional()
  @IsDateString({}, { message: CreateOfferValidationMessage.publicDate.invalidFormat })
  public publicDate: Date;

  @IsIn(
    [CITIES.Paris, CITIES.Cologne, CITIES.Brussels, CITIES.Amsterdam, CITIES.Hamburg, CITIES.Dusseldorf],
    {
      message: CreateOfferValidationMessage.city.name.invalidFormat,
    },
  )
  @MinLength(1, { message: CreateOfferValidationMessage.city.name.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.city.name.maxLength })
  public city: City;

  @IsUrl(
    {},
    {
      message: CreateOfferValidationMessage.previewImage.isUrl,
    },
  )
  @Matches(/\.(jpg|png)(\?.*)?$/i, {
    message: CreateOfferValidationMessage.previewImage.matches,
  })
  public previewImage: string;

  @IsArray({ message: CreateOfferValidationMessage.images.invalidFormat })
  @ArrayMinSize(6, { message: CreateOfferValidationMessage.images.ArrayMinSize })
  @ArrayMaxSize(6, { message: CreateOfferValidationMessage.images.ArrayMaxSize })
  public images: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsBoolean({ message: CreateOfferValidationMessage.isFavorite.invalidFormat })
  public isFavorite: boolean;

  @IsIn([OFFER_TYPE.House, OFFER_TYPE.Apartment, OFFER_TYPE.Hotel, OFFER_TYPE.Room], {
    message: CreateOfferValidationMessage.type.invalidFormat,
  })
  public type: OfferType;

  @IsInt({ message: CreateOfferValidationMessage.room.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.room.minValue })
  @Max(8, { message: CreateOfferValidationMessage.room.maxValue })
  public room: number;

  @IsInt({ message: CreateOfferValidationMessage.bedroom.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.bedroom.minValue })
  @Max(10, { message: CreateOfferValidationMessage.bedroom.maxValue })
  public bedroom: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.goods.invalidFormat })
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
      message: CreateOfferValidationMessage.goods.invalidFormat,
    },
  )
  public goods: string[];

  @IsMongoId({ message: CreateOfferValidationMessage.hostId.invalidId })
  public hostId: string;

  @ValidateNested()
  public location: Location;
}
