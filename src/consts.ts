export enum CommandName {
  Help = '--help',
  Import = '--import',
  Version = '--version',
  Generate = '--generate'
}

export enum EventList {
  Line = 'line',
  End = 'end'
}

export const GOODS = {
  Breakfast: 'Breakfast',
  AirConditioning: 'Air conditioning',
  LaptopFriendlyWorkspace: 'Laptop friendly workspace',
  BabySeat: 'Baby seat',
  Washer: 'Washer',
  Towels: 'Towels',
  Fridge: 'Fridge',
} as const;

export const OFFER_TYPE = {
  Room: 'room',
  Apartment: 'apartment',
  House: 'house',
  Hotel: 'hotel',
} as const;

export const CITIES = {
  Paris: 'Paris',
  Cologne: 'Cologne',
  Brussels: 'Brussels',
  Amsterdam: 'Amsterdam',
  Hamburg: 'Hamburg',
  Dusseldorf: 'Dusseldorf',
} as const;
