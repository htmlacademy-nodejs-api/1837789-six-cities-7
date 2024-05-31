import { Location, LocationValidation } from './location.type.js';
import { IsString, Length, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CitiesEnum } from '../../consts.js';

export type City = {
  name: string;
  location: Location
}

export const CityValidationConstant = {
  name: {
    minLength: 1,
    maxLength: 100,
  },
};

export const CityValidationMessage = {
  name: {
    isString: 'City name must be a string',
    isEnum: 'Name must be one of: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf',
    length: `City name must be between ${CityValidationConstant.name.minLength} and ${CityValidationConstant.name.maxLength} characters`,
  },
  location: 'Location validation failed',
};

export class CityValidation {
  @IsString({message: CityValidationMessage.name.isString})
  @IsEnum(CitiesEnum, {message: CityValidationMessage.name.isEnum})
  @Length(CityValidationConstant.name.minLength, CityValidationConstant.name.maxLength, {message: CityValidationMessage.name.length})
  public name: string;

  @ValidateNested()
  @Type(() => LocationValidation)
  public location: LocationValidation;
}
