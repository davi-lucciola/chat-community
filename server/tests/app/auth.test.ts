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

const SIGN_UP_EMAILS = {
  success: 'signup-test@example.com',
  duplicate: 'signup-duplicate@example.com',
};

describe('POST /api/sign-up', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $in: Object.values(SIGN_UP_EMAILS) } });
    await app.close();
  });

  describe('when body is valid', () => {
    beforeEach(async () => {
      await User.deleteMany({ email: SIGN_UP_EMAILS.success });
    });

    it('should return 200 with the created user data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/sign-up',
        payload: { name: 'New User', email: SIGN_UP_EMAILS.success, password: 'pass1234' },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        _id: expect.any(String),
        name: 'New User',
        email: SIGN_UP_EMAILS.success,
        imageUrl: null,
      });
      expect(response.json()).not.toHaveProperty('status');
      expect(response.json()).not.toHaveProperty('password');

      const userInDb = await User.findOne({ email: SIGN_UP_EMAILS.success });
      expect(userInDb).not.toBeNull();
      expect(userInDb?.name).toBe('New User');
      expect(userInDb?.email).toBe(SIGN_UP_EMAILS.success);
    });
  });

  describe('when email is already registered', () => {
    it('should return 400 with duplicate email message', async () => {
      await app.inject({
        method: 'POST',
        url: '/api/sign-up',
        payload: { name: 'First User', email: SIGN_UP_EMAILS.duplicate, password: 'pass1234' },
      });

      const response = await app.inject({
        method: 'POST',
        url: '/api/sign-up',
        payload: { name: 'Second User', email: SIGN_UP_EMAILS.duplicate, password: 'pass1234' },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ message: 'Already exists a user with this email.' });
    });
  });

  describe('when request body is invalid', () => {
    it('should return 400 when name is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/sign-up',
        payload: { email: SIGN_UP_EMAILS.success, password: 'pass1234' },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when email is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/sign-up',
        payload: { name: 'New User', password: 'pass1234' },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when email format is invalid', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/sign-up',
        payload: { name: 'New User', email: 'notanemail', password: 'pass1234' },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when password is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/sign-up',
        payload: { name: 'New User', email: SIGN_UP_EMAILS.success },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when password has less than 4 characters', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/sign-up',
        payload: { name: 'New User', email: SIGN_UP_EMAILS.success, password: 'abc' },
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
