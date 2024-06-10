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
  OfferController: Symbol.for('OfferController'),
  ReviewController: Symbol.for('ReviewController'),

  AuthService: Symbol.for('AuthService'),
  AuthExceptionFilter: Symbol.for('AuthExceptionFilter'),
  HttpExceptionFilter: Symbol.for('HttpExceptionFilter'),
  ValidationExceptionFilter: Symbol.for('ValidationExceptionFilter'),

  PathTransformer: Symbol.for('PathTransformer'),
} as const;
