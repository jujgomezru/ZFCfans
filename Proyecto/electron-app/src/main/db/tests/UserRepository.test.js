import { beforeEach, describe, expect, test, vi } from 'vitest';
import { mockBetterSqlite3, mockUsers } from './mockData.js';
import UserRepository from '../repositories/UserRepository.js';

// Mock better-sqlite3
mockBetterSqlite3();

describe('UserRepository', () => {
  let userRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    userRepository = new UserRepository();
  });

  describe('findByEmail', () => {
    test('should find user by email', () => {
      const user = userRepository.findByEmail('admin@zfcfans.com');

      expect(user).toBeDefined();
      expect(user.email).toBe('admin@zfcfans.com');
      expect(user.username).toBe('admin');
    });

    test('should return null for non-existent email', () => {
      const mockStmt = {
        get: vi.fn(() => null),
      };
      userRepository.db.prepare.mockReturnValue(mockStmt);

      const user = userRepository.findByEmail('nonexistent@example.com');

      expect(user).toBeNull();
    });
  });

  describe('createUser', () => {
    test('should create a new user with correct fields', () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'secure_password',
      };

      const userId = userRepository.createUser(userData);

      expect(userId).toBe(4); // Next ID after existing mock data
      expect(userRepository.db.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users (username, email, password)'),
      );
    });

    test('should handle user creation with all required fields', () => {
      const mockStmt = {
        run: vi.fn(() => ({ lastInsertRowid: 5, changes: 1 })),
      };
      userRepository.db.prepare.mockReturnValue(mockStmt);

      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123',
      };

      const userId = userRepository.createUser(userData);

      expect(mockStmt.run).toHaveBeenCalledWith('testuser', 'test@example.com', 'testpass123');
      expect(userId).toBe(5);
    });
  });

  describe('exists', () => {
    test('should return true for existing user email', () => {
      const mockStmt = {
        get: vi.fn(() => ({ count: 1 })),
      };
      userRepository.db.prepare.mockReturnValue(mockStmt);

      const exists = userRepository.exists('admin@zfcfans.com');

      expect(exists).toBe(true);
      expect(userRepository.db.prepare).toHaveBeenCalledWith(
        'SELECT COUNT(*) as count FROM users WHERE email = ?',
      );
    });

    test('should return false for non-existent user email', () => {
      const mockStmt = {
        get: vi.fn(() => ({ count: 0 })),
      };
      userRepository.db.prepare.mockReturnValue(mockStmt);

      const exists = userRepository.exists('nonexistent@example.com');

      expect(exists).toBe(false);
    });
  });

  describe('inherited methods from BaseRepository', () => {
    test('should use correct table name and primary key', () => {
      expect(userRepository.tableName).toBe('users');
      expect(userRepository.primaryKey).toBe('id');
    });

    test('should call parent findById method', () => {
      const userId = 1;
      const user = userRepository.findById(userId);

      expect(user).toBeDefined();
      expect(user.id).toBe(userId);
    });

    test('should call parent findAll method', () => {
      const users = userRepository.findAll();

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBe(mockUsers.length);
    });
  });

  describe('edge cases', () => {
    test('should handle empty email search', () => {
      const mockStmt = {
        get: vi.fn(() => null),
      };
      userRepository.db.prepare.mockReturnValue(mockStmt);

      const user = userRepository.findByEmail('');

      expect(user).toBeNull();
    });

    test('should handle database errors gracefully', () => {
      const mockStmt = {
        run: vi.fn(() => {
          throw new Error('Database constraint violation');
        }),
      };
      userRepository.db.prepare.mockReturnValue(mockStmt);

      expect(() => {
        userRepository.createUser({
          username: 'duplicate',
          email: 'admin@zfcfans.com', // Email ya existe
          password: 'password',
        });
      }).toThrow('Database constraint violation');
    });
  });
});
