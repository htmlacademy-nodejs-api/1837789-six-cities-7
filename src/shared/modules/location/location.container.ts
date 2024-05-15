import { DefaultLocationService } from './default-location.service.js';
import { LocationService } from './location-service.interface.js';
import { LocationEntity, LocationModel } from './location.entity.js';
import { Component } from '../../types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';

export function createLocationContainer(): Container {
  const locationContainer = new Container();
  locationContainer.bind<types.ModelType<LocationEntity>>(Component.LocationModel).toConstantValue(LocationModel);
  locationContainer.bind<LocationService>(Component.LocationService).to(DefaultLocationService).inSingletonScope();

  return locationContainer;
}
