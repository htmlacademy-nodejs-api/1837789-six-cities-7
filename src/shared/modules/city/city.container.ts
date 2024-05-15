import { CityService } from './city-service.interface.js';
import { CityEntity, CityModel } from './city.entity.js';
import { DefaultCityService } from './default-city.service.js';
import { Component } from '../../types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';

export function createCityContainer(): Container {
  const cityContainer = new Container();
  cityContainer.bind<types.ModelType<CityEntity>>(Component.CityModel).toConstantValue(CityModel);
  cityContainer.bind<CityService>(Component.CityService).to(DefaultCityService).inSingletonScope();

  return cityContainer;
}
