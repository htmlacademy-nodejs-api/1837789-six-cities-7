import { Request } from 'express';

import { RequestBody, RequestParams } from '../../libs/rest/index.js';
import { CreateUserDto } from './create-user.dto.js';

export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDto>;
