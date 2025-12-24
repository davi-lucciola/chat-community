import axios from 'axios';

export type MessageDTO = {
  message: string;
};

export class ApiError extends Error {}
export class BadRequestError extends ApiError {}
export class UnauthorizedError extends ApiError {}
export class InternalServerError extends ApiError {}

type UnauthorizedHandler = (message: string) => void;
let onUnauthorized: UnauthorizedHandler | undefined;

export const setUnauthorizedHandler = (handler?: UnauthorizedHandler) => {
  onUnauthorized = handler;
};

export const triggerUnauthorized = (message: string) => {
  if (onUnauthorized) onUnauthorized(message);
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  validateStatus: () => true,
});

api.interceptors.response.use((response) => {
  const body = response.data;

  if (response.status === 401) {
    triggerUnauthorized(body.message);
    return Promise.reject(new UnauthorizedError(body.message));
  }

  if (response.status >= 400 && response.status < 500) {
    return Promise.reject(new BadRequestError(body.message));
  }

  if (response.status >= 500) {
    return Promise.reject(new InternalServerError(body.message));
  }

  return response;
});
