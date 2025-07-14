import { beforeEach, describe, expect, test, vi } from 'vitest';
import { mockBetterSqlite3, mockNotifications } from './mockData.js';
import NotificationRepository from '../repositories/NotificationRepository.js';

// Mock better-sqlite3
mockBetterSqlite3();

describe('NotificationRepository', () => {
  let notificationRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    notificationRepository = new NotificationRepository();
  });

  describe('findByUser', () => {
    test('should find notifications for specific user', () => {
      const userId = 1;
      const userNotifications = mockNotifications.filter(n => n.id_user === userId);
      const mockStmt = {
        all: vi.fn(() => userNotifications),
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      const notifications = notificationRepository.findByUser(userId);

      expect(notifications).toHaveLength(1);
      expect(notifications[0].id_user).toBe(userId);
      expect(notifications[0].title).toBe('Primer cóctel creado');
      expect(mockStmt.all).toHaveBeenCalledWith(userId);
    });

    test('should return empty array for user with no notifications', () => {
      const userId = 999;
      const mockStmt = {
        all: vi.fn(() => []),
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      const notifications = notificationRepository.findByUser(userId);

      expect(notifications).toHaveLength(0);
    });

    test('should include related cocktail information in JOIN query', () => {
      const userId = 1;
      const notificationWithCocktail = {
        id: 1,
        id_user: 1,
        type: 'logro',
        title: 'Primer cóctel creado',
        message: '¡Felicidades! Has creado tu primer cóctel',
        is_read: 0,
        cocktail_name: 'Mojito Clásico',
        cocktail_difficulty: 'fácil',
      };

      const mockStmt = {
        all: vi.fn(() => [notificationWithCocktail]),
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      const notifications = notificationRepository.findByUser(userId);

      expect(notifications[0].cocktail_name).toBe('Mojito Clásico');
      expect(notifications[0].cocktail_difficulty).toBe('fácil');
      expect(notificationRepository.db.prepare).toHaveBeenCalledWith(
        expect.stringContaining('LEFT JOIN cocktails c ON n.related_cocktail_id = c.id'),
      );
    });
  });

  describe('createNotification', () => {
    test('should create notification with all fields', () => {
      const mockStmt = {
        run: vi.fn(() => ({ lastInsertRowid: 3, changes: 1 })),
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      const notificationData = {
        id_user: 2,
        type: 'recordatorio',
        title: 'Hora del cóctel',
        message: 'Es momento de preparar tu cóctel favorito',
        is_system: 0,
        related_cocktail_id: 1,
      };

      const notificationId = notificationRepository.createNotification(notificationData);

      expect(mockStmt.run).toHaveBeenCalledWith(
        2,
        'recordatorio',
        'Hora del cóctel',
        'Es momento de preparar tu cóctel favorito',
        0,
        1,
      );
      expect(notificationId).toBe(3);
    });

    test('should create notification with default values', () => {
      const mockStmt = {
        run: vi.fn(() => ({ lastInsertRowid: 4, changes: 1 })),
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      const notificationData = {
        type: 'advertencia',
        title: 'Advertencia básica',
        message: 'Mensaje de advertencia',
      };

      const notificationId = notificationRepository.createNotification(notificationData);

      expect(mockStmt.run).toHaveBeenCalledWith(
        null, // id_user default
        'advertencia',
        'Advertencia básica',
        'Mensaje de advertencia',
        null, // is_system default
        null, // related_cocktail_id default
      );
      expect(notificationId).toBe(4);
    });
  });

  describe('markAsRead', () => {
    test('should mark notification as read', () => {
      const notificationId = 1;
      const mockStmt = {
        run: vi.fn(() => ({ changes: 1 })),
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      const result = notificationRepository.markAsRead(notificationId);

      expect(result).toBe(true);
      expect(mockStmt.run).toHaveBeenCalledWith(notificationId);
      expect(notificationRepository.db.prepare).toHaveBeenCalledWith(
        `UPDATE notifications 
         SET is_read = 1, read_at = datetime('now') 
         WHERE id = ?`,
      );
    });

    test('should return false if notification not found', () => {
      const notificationId = 999;
      const mockStmt = {
        run: vi.fn(() => ({ changes: 0 })),
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      const result = notificationRepository.markAsRead(notificationId);

      expect(result).toBe(false);
    });
  });

  describe('markAllAsReadForUser', () => {
    test('should mark all user notifications as read', () => {
      const userId = 1;
      const mockStmt = {
        run: vi.fn(() => ({ changes: 3 })), // 3 notificaciones marcadas
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      const count = notificationRepository.markAllAsReadForUser(userId);

      expect(count).toBe(3);
      expect(mockStmt.run).toHaveBeenCalledWith(userId);
      expect(notificationRepository.db.prepare).toHaveBeenCalledWith(
        `UPDATE notifications 
         SET is_read = 1, read_at = datetime('now') 
         WHERE id_user = ? AND is_read = 0`,
      );
    });

    test('should return 0 if no unread notifications for user', () => {
      const userId = 2;
      const mockStmt = {
        run: vi.fn(() => ({ changes: 0 })),
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      const count = notificationRepository.markAllAsReadForUser(userId);

      expect(count).toBe(0);
    });
  });

  describe('getUnreadCount', () => {
    test('should return correct unread count for user', () => {
      const userId = 1;
      const mockStmt = {
        get: vi.fn(() => ({ count: 2 })),
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      const count = notificationRepository.getUnreadCount(userId);

      expect(count).toBe(2);
      expect(mockStmt.get).toHaveBeenCalledWith(userId);
      expect(notificationRepository.db.prepare).toHaveBeenCalledWith(
        'SELECT COUNT(*) as count FROM notifications WHERE id_user = ? AND is_read = 0',
      );
    });

    test('should return 0 for user with no unread notifications', () => {
      const userId = 3;
      const mockStmt = {
        get: vi.fn(() => ({ count: 0 })),
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      const count = notificationRepository.getUnreadCount(userId);

      expect(count).toBe(0);
    });
  });

  describe('deleteOldNotifications', () => {
    test('should delete notifications older than specified days', () => {
      const days = 30;
      const mockStmt = {
        run: vi.fn(() => ({ changes: 5 })), // 5 notificaciones eliminadas
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      const deletedCount = notificationRepository.deleteOldNotifications(days);

      expect(deletedCount).toBe(5);
      expect(mockStmt.run).toHaveBeenCalledWith(days);
      expect(notificationRepository.db.prepare).toHaveBeenCalledWith(
        `DELETE FROM notifications 
         WHERE created_at < datetime('now', '-' || ? || ' days')`,
      );
    });

    test('should use default 30 days if not specified', () => {
      const mockStmt = {
        run: vi.fn(() => ({ changes: 2 })),
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      const deletedCount = notificationRepository.deleteOldNotifications();

      expect(deletedCount).toBe(2);
      expect(mockStmt.run).toHaveBeenCalledWith(30); // Default value
    });
  });

  describe('inherited methods from BaseRepository', () => {
    test('should use correct table name and primary key', () => {
      expect(notificationRepository.tableName).toBe('notifications');
      expect(notificationRepository.primaryKey).toBe('id');
    });

    test('should find notification by id', () => {
      const notificationId = 1;
      const mockStmt = {
        get: vi.fn(() => mockNotifications.find(n => n.id === notificationId)),
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      const notification = notificationRepository.findById(notificationId);

      expect(notification).toBeDefined();
      expect(notification.id).toBe(notificationId);
      expect(notification.title).toBe('Primer cóctel creado');
    });
  });

  describe('edge cases and error handling', () => {
    test('should handle invalid notification types', () => {
      const mockStmt = {
        run: vi.fn(() => {
          throw new Error('CHECK constraint failed: type IN (...)');
        }),
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      expect(() => {
        notificationRepository.createNotification({
          type: 'tipo_invalido',
          title: 'Test',
          message: 'Test message',
        });
      }).toThrow('CHECK constraint failed');
    });

    test('should handle null user gracefully', () => {
      const mockStmt = {
        all: vi.fn(() => []),
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      const notifications = notificationRepository.findByUser(null);

      expect(notifications).toHaveLength(0);
    });

    test('should handle database errors in mark operations', () => {
      const mockStmt = {
        run: vi.fn(() => {
          throw new Error('Database lock error');
        }),
      };
      notificationRepository.db.prepare.mockReturnValue(mockStmt);

      expect(() => {
        notificationRepository.markAsRead(1);
      }).toThrow('Database lock error');
    });
  });
});
