import {IsLatitude, IsLongitude} from 'class-validator';

export type Location = {
  latitude: number;
  longitude: number;
}

export const LocationValidationMessage = {
  latitude: {
    isLatitude: 'Latitude must be a valid latitude value between -90 and 90',
  },
  longitude: {
    isLongitude: 'Longitude must be a valid longitude value between -180 and 180',
  },
};

export class LocationValidation {
  @IsLatitude({message: LocationValidationMessage.latitude.isLatitude})
  public latitude: number;

  @IsLongitude({message: LocationValidationMessage.longitude.isLongitude})
  public longitude: number;
}
