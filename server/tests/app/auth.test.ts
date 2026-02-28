import type { FastifyInstance } from 'fastify';
import { User } from '@/app/user/user.model';
import hash from '@/utils/hash';
import { createTestApp } from '../helpers/createTestApp';

const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};

describe('POST /api/sign-in', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createTestApp();
    await User.create({
      ...TEST_USER,
      password: await hash.hashPassword(TEST_USER.password),
    });
  });

  afterAll(async () => {
    await User.deleteMany({ email: TEST_USER.email });
    await app.close();
  });

  describe('when credentials are valid', () => {
    it('should return 200 with token payload', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/sign-in',
        payload: { email: TEST_USER.email, password: TEST_USER.password },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        accessToken: expect.any(String),
        type: 'Bearer',
      });
    });

    it('should set an HTTP-only cookie with the access token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/sign-in',
        payload: { email: TEST_USER.email, password: TEST_USER.password },
      });

      const setCookieHeader = response.headers['set-cookie'] as string;
      expect(setCookieHeader).toBeDefined();
      expect(setCookieHeader).toContain('accessToken=');
      expect(setCookieHeader).toContain('HttpOnly');
    });
  });

  describe('when email does not exist', () => {
    it('should return 401 with invalid credentials message', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/sign-in',
        payload: { email: 'nonexistent@example.com', password: TEST_USER.password },
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({ message: 'Invalid email or password.' });
    });
  });

  describe('when password is wrong', () => {
    it('should return 401 with invalid credentials message', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/sign-in',
        payload: { email: TEST_USER.email, password: 'wrongpassword' },
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({ message: 'Invalid email or password.' });
    });
  });

  describe('when request body is invalid', () => {
    it('should return 400 when email is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/sign-in',
        payload: { password: TEST_USER.password },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when email format is invalid', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/sign-in',
        payload: { email: 'notanemail', password: TEST_USER.password },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when password is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/sign-in',
        payload: { email: TEST_USER.email },
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
