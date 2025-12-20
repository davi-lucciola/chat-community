export const API_URL: string = import.meta.env.API_URL;

export class ApiError extends Error {}
export class BadRequestError extends ApiError {}
export class InternalServerError extends ApiError {}
