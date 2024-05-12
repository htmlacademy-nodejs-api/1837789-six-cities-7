export const Component = {
  RestApplication: Symbol.for('RestApplication'),

  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),

  DatabaseClient: Symbol.for('DatabaseClient'),

  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),

  LocationModel: Symbol.for('LocationModel'),
  LocationService: Symbol.for('LocationService'),

  CityModel: Symbol.for('CityModel'),
  CityService: Symbol.for('CityService'),

  ReviewModel: Symbol.for('ReviewModel'),
  ReviewService: Symbol.for('ReviewService'),

  OfferModel: Symbol.for('OfferModel'),
  OfferService: Symbol.for('OfferService'),
} as const;
