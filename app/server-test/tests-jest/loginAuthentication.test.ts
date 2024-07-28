// tests-jest/authentication.test.ts
import { authenticateAdmin, authenticateInstructor, authenticateStudent } from '../../src/db';

describe('Authentication Tests', () => {

  describe('authenticateAdmin', () => {
    test('should authenticate admin with valid credentials', async () => {
      const mockEmail = 'admin@example.com';
      const mockPassword = 'password123';

      try {
        const isAuthenticated = await authenticateAdmin(mockEmail, mockPassword, global.pool);
        expect(isAuthenticated).toBe(true);
      } catch (error) {
        console.error('Error in authenticateAdmin with valid credentials:', error);
        throw error;
      }
    });

    test('should not authenticate admin with invalid credentials', async () => {
      const mockEmail = 'admin@example.com';
      const mockPassword = 'wrongpassword';

      try {
        const isAuthenticated = await authenticateAdmin(mockEmail, mockPassword, global.pool);
        expect(isAuthenticated).toBe(false);
      } catch (error) {
        console.error('Error in authenticateAdmin with invalid credentials:', error);
        throw error;
      }
    });
  });

  describe('authenticateInstructor', () => {
    test('should authenticate instructor with valid credentials', async () => {
      const mockEmail = 'scott.faz@example.com';
      const mockPassword = 'password123';

      try {
        const isAuthenticated = await authenticateInstructor(mockEmail, mockPassword, global.pool);
        expect(isAuthenticated).toBe(true);
      } catch (error) {
        console.error('Error in authenticateInstructor with valid credentials:', error);
        throw error;
      }
    });

    test('should not authenticate instructor with invalid credentials', async () => {
      const mockEmail = 'scott.faz@example.com';
      const mockPassword = 'wrongpassword';

      try {
        const isAuthenticated = await authenticateInstructor(mockEmail, mockPassword, global.pool);
        expect(isAuthenticated).toBe(false);
      } catch (error) {
        console.error('Error in authenticateInstructor with invalid credentials:', error);
        throw error;
      }
    });
  });

  describe('authenticateStudent', () => {
    test('should authenticate student with valid credentials', async () => {
      const mockEmail = 'john.doe@example.com';
      const mockPassword = 'password123';

      try {
        const isAuthenticated = await authenticateStudent(mockEmail, mockPassword, global.pool);
        expect(isAuthenticated).toBe(true);
      } catch (error) {
        console.error('Error in authenticateStudent with valid credentials:', error);
        throw error;
      }
    });

    test('should not authenticate student with invalid credentials', async () => {
      const mockEmail = 'john.doe@example.com';
      const mockPassword = 'wrongpassword';

      try {
        const isAuthenticated = await authenticateStudent(mockEmail, mockPassword, global.pool);
        expect(isAuthenticated).toBe(false);
      } catch (error) {
        console.error('Error in authenticateAdmin with invalid credentials:', error);
        throw error;
      }
    });
  });
});
