export const CreatereviewMessages = {
  offerId: {
    invalidFormat: 'offerId field must be a valid id'
  },
  comment: {
    invalidFormat: 'text is required',
    lengthField: 'min length is 5, max is 2024'
  },
  publishDate: {
    invalidFormat: 'PublicDate must be a valid ISO date',
  },
  rating: {
    invalidFormat: 'rating must be an integer',
    minValue: 'Min length for rating path is 1',
    maxValue: 'Max length for rating path is 5',
  },

  hostId: {
    invalidFormat: 'userId field must be a valid id'
  },
} as const;
