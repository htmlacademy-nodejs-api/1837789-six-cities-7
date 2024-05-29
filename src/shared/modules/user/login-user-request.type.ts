import { Request } from 'express';
import { RequestBody, RequestParams } from '../../libs/rest/index.js';
import { LoginUserDto } from './login-user.dto.js';

export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDto>;
