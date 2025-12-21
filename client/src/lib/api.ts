export const API_URL: string = import.meta.env.VITE_API_URL;

export class ApiError extends Error {}
export class BadRequestError extends ApiError {}
export class InternalServerError extends ApiError {}
