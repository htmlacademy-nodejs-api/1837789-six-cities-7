export const CreateUserMessages = {
  name: {
    invalidFormat: 'name is required',
    lengthField: 'min length is 1, max is 15',
  },
  password: {
    invalidFormat: 'password is required',
    lengthField: 'min length for password is 6, max is 12',
  },
  email: {
    invalidFormat: 'email must be a valid address',
  },
  type: {
    invalidFormat: 'status must be usual or pro',
  },
  avatarUrl: {
    invalidFormat: 'avatarUrl is required',
    isUrl: 'AvatarUrl must be a valid URL',
  }
};
