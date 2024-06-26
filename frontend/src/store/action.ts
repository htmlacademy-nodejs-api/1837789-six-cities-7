import {createAsyncThunk} from '@reduxjs/toolkit';
import type {AxiosError, AxiosInstance} from 'axios';
import type {History} from 'history';
import {
  adaptCommentsToClient,
  adaptCommentToClient,
  adaptOffersShortToClient,
  adaptOffersToClient,
  adaptOfferToClient
} from '../adapters/adapters-to-client';
import {adaptNewOfferToServer, adaptOfferToServer} from '../adapters/adapters-to-server';
import {ApiRoute, AppRoute, HttpCode} from '../const';
import {OfferDTO} from '../dto/offer.dto';
import {ReviewDTO} from '../dto/review.dto';
import {UserDTO} from '../dto/user.dto';
import type {Comment, CommentAuth, FavoriteAuth, NewOffer, Offer, User, UserAuth, UserRegister} from '../types/types';
import {Token} from '../utils';

type Extra = {
  api: AxiosInstance;
  history: History;
};

export const Action = {
  FETCH_OFFERS: 'offers/fetch',
  FETCH_OFFER: 'offer/fetch',
  POST_OFFER: 'offer/post-offer',
  EDIT_OFFER: 'offer/edit-offer',
  DELETE_OFFER: 'offer/delete-offer',
  FETCH_FAVORITE_OFFERS: 'offers/fetch-favorite',
  FETCH_PREMIUM_OFFERS: 'offers/fetch-premium',
  FETCH_COMMENTS: 'offer/fetch-comments',
  POST_COMMENT: 'offer/post-comment',
  POST_FAVORITE: 'offer/post-favorite',
  DELETE_FAVORITE: 'offer/delete-favorite',
  LOGIN_USER: 'user/login',
  LOGOUT_USER: 'user/logout',
  FETCH_USER_STATUS: 'user/fetch-status',
  REGISTER_USER: 'user/register',
};

export const fetchOffer = createAsyncThunk<Offer, Offer['id'], { extra: Extra }>(
  Action.FETCH_OFFER,
  async (id, {extra}) => {
    const {api, history} = extra;
    try {
      const {data} = await api.get<OfferDTO>(`${ApiRoute.Offers}/${id}`);
      const result = adaptOfferToClient(data);
      return result;

    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NotFound) {
        history.push(AppRoute.NotFound);
      }
      return Promise.reject(error);
    }
  });

export const fetchOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_OFFERS,
  async (_, {extra}) => {
    const {api} = extra;
    const {data} = await api.get<OfferDTO[]>(ApiRoute.Offers);
    return adaptOffersShortToClient(data);
  });

export const fetchPremiumOffers = createAsyncThunk<Offer[], string, { extra: Extra }>(
  Action.FETCH_PREMIUM_OFFERS,
  async (cityName, {extra}) => {
    const {api} = extra;
    const {data} = await api.get<OfferDTO[]>(`${ApiRoute.Premium}?cityName=${cityName}`);

    return adaptOffersToClient(data);
  });

export const postOffer = createAsyncThunk<Offer, NewOffer, { extra: Extra }>(
  Action.POST_OFFER,
  async (newOffer, {extra}) => {
    const {api, history} = extra;
    const adaptedNewOffer = adaptNewOfferToServer(newOffer);

    const {data} = await api.post<OfferDTO>(ApiRoute.Offers, adaptedNewOffer);
    history.push(`${AppRoute.Property}/${data.id}`);

    return adaptOfferToClient(data);
  });

export const editOffer = createAsyncThunk<Offer, Offer, { extra: Extra }>(
  Action.EDIT_OFFER,
  async (offer, {extra}) => {
    const {api, history} = extra;
    const adaptedOffer = adaptOfferToServer(offer);

    const {data} = await api.put<OfferDTO>(`${ApiRoute.Offers}/${offer.id}`, adaptedOffer);
    history.push(`${AppRoute.Property}/${data.id}`);

    return adaptOfferToClient(data);
  });

export const deleteOffer = createAsyncThunk<void, string, { extra: Extra }>(
  Action.DELETE_OFFER,
  async (id, {extra}) => {
    const {api, history} = extra;
    await api.delete(`${ApiRoute.Offers}/${id}`);
    history.push(AppRoute.Root);
  });

export const fetchUserStatus = createAsyncThunk<UserAuth['email'], undefined, { extra: Extra }>(
  Action.FETCH_USER_STATUS,
  async (_, {extra}) => {
    const {api} = extra;

    try {
      const {data} = await api.get<User>(ApiRoute.Login);
      return data.email;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NoAuth) {
        Token.drop();
      }

      return Promise.reject(error);
    }
  });

export const loginUser = createAsyncThunk<UserAuth['email'], UserAuth, { extra: Extra }>(
  Action.LOGIN_USER,
  async ({email, password}, {extra}) => {
    const {api, history} = extra;
    const {data} = await api.post<User & { token: string }>(ApiRoute.Login, {email, password});
    const {token} = data;

    Token.save(token);
    history.push(AppRoute.Root);

    return email;
  });

export const logoutUser = createAsyncThunk<void, undefined, { extra: Extra }>(
  Action.LOGOUT_USER,
  async () => {
    Token.drop();
  });

export const registerUser = createAsyncThunk<void, UserRegister, { extra: Extra }>(
  Action.REGISTER_USER,
  async ({email, password, name, type}, {extra}) => {
    const {api, history} = extra;
    const userData: UserRegister = {name, email, password, type};

    await api.post<UserDTO>(ApiRoute.Register, userData);

    history.push(AppRoute.Login);
  });

export const fetchComments = createAsyncThunk<Comment[], Offer['id'], { extra: Extra }>(
  Action.FETCH_COMMENTS,
  async (id, {extra}) => {
    const {api} = extra;
    const {data} = await api.get<ReviewDTO[]>(`/offers/${id}/reviews`);
    return adaptCommentsToClient(data);
  });

export const postComment = createAsyncThunk<Comment, CommentAuth, { extra: Extra }>(
  Action.POST_COMMENT,
  async ({id, comment, rating}, {extra}) => {
    const {api} = extra;
    const {data} = await api.post<ReviewDTO>(`${ApiRoute.Comments}/${id}`, {comment, rating});

    return adaptCommentToClient(data);
  });

export const fetchFavoriteOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_FAVORITE_OFFERS,
  async (_, {extra}) => {
    const {api} = extra;
    const {data} = await api.get<OfferDTO[]>(ApiRoute.Favorite);
    return adaptOffersShortToClient(data);
  });

export const postFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.POST_FAVORITE, async (id, {extra}) => {
  const {api, history} = extra;

  try {
    const {data} = await api.post(
      `${AppRoute.Favorites}/${id}`,
    );

    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.NoAuth) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});

export const deleteFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.DELETE_FAVORITE, async (id, {extra}) => {
  const {api, history} = extra;

  try {
    const {data} = await api.delete<Offer>(
      `${AppRoute.Favorites}/${id}`
    );

    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.NoAuth) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});
