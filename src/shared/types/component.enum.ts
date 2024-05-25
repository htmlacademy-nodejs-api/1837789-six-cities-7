export const Component = {
  RestApplication: Symbol.for('RestApplication'),

  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),

  DatabaseClient: Symbol.for('DatabaseClient'),

  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),

  ReviewModel: Symbol.for('ReviewModel'),
  ReviewService: Symbol.for('ReviewService'),

  OfferModel: Symbol.for('OfferModel'),
  OfferService: Symbol.for('OfferService'),

  ExceptionFilter: Symbol.for('ExceptionFilter'),
  UserController: Symbol.for('UserController'),
} as const;
