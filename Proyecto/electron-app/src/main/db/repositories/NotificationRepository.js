import BaseRepository from './BaseRepository.js';

class NotificationRepository extends BaseRepository {
  constructor() {
    super('notifications', 'id');
  }

  /**
   * Obtener notificaciones de un usuario
   */
  findByUserId(userId, options = {}) {
    let query = `
      SELECT
        n.*,
        c.name AS cocktail_name
      FROM notifications n
      LEFT JOIN cocktails c ON n.related_cocktail_id = c.id
      WHERE n.id_user = ?
    `;

    const params = [userId];

    if (options.unread_only) {
      query += ' AND n.is_read = 0';
    }

    if (options.type) {
      query += ' AND n.type = ?';
      params.push(options.type);
    }

    query += ' ORDER BY n.created_at DESC';

    if (options.limit) {
      query += ` LIMIT ${options.limit}`;
    }

    return this.db.prepare(query).all(...params);
  }

  /**
   * Crear nueva notificación
   */
  createNotification(notificationData) {
    const stmt = this.db.prepare(`
      INSERT INTO notifications
      (id_user, type, title, message, is_system, related_cocktail_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      notificationData.id_user || null,
      notificationData.type,
      notificationData.title,
      notificationData.message,
      notificationData.is_system || 0,
      notificationData.related_cocktail_id || null,
    );

    return result.lastInsertRowid;
  }

  /**
   * Marcar notificación como leída
   */
  markAsRead(notificationId) {
    const stmt = this.db.prepare(`
      UPDATE notifications
      SET is_read = 1, read_at = datetime('now')
      WHERE id = ?
    `);

    const result = stmt.run(notificationId);
    return result.changes > 0;
  }

  /**
   * Marcar todas las notificaciones de un usuario como leídas
   */
  markAllAsRead(userId) {
    const stmt = this.db.prepare(`
      UPDATE notifications
      SET is_read = 1, read_at = datetime('now')
      WHERE id_user = ? AND is_read = 0
    `);

    const result = stmt.run(userId);
    return result.changes;
  }

  /**
   * Contar notificaciones no leídas
   */
  countUnread(userId) {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE id_user = ? AND is_read = 0
    `);

    return stmt.get(userId).count;
  }

  /**
   * Crear notificación del sistema
   */
  createSystemNotification(title, message, type = 'actualizacion') {
    return this.createNotification({
      title,
      message,
      type,
      is_system: 1,
    });
  }

  /**
   * Limpiar notificaciones antiguas
   */
  cleanOldNotifications(daysOld = 30) {
    const stmt = this.db.prepare(`
      DELETE FROM notifications
      WHERE is_read = 1
      AND created_at < datetime('now', '-${daysOld} days')
    `);

    const result = stmt.run();
    return result.changes;
  }
}

export default NotificationRepository;
