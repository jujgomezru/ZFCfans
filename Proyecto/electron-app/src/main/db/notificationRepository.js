import db from './database.js';

// ================================
// REPOSITORIO DE NOTIFICACIONES
// ================================

const NotificationRepository = {
  // ===== CREAR NOTIFICACIÓN =====
  create: notificationData => {
    const stmt = db.prepare(`
      INSERT INTO notifications 
      (id_user, type, title, message, data, scheduled_for, priority, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      notificationData.id_user,
      notificationData.type,
      notificationData.title,
      notificationData.message,
      typeof notificationData.data === 'object'
        ? JSON.stringify(notificationData.data)
        : notificationData.data,
      notificationData.scheduled_for || new Date().toISOString(),
      notificationData.priority || 'normal',
      notificationData.expires_at || null,
    );

    return result.lastInsertRowid;
  },

  // ===== OBTENER NOTIFICACIÓN POR ID =====
  getById: id => {
    const stmt = db.prepare('SELECT * FROM notifications WHERE id = ?');
    const notification = stmt.get(id);

    if (notification && notification.data) {
      try {
        notification.data = JSON.parse(notification.data);
      } catch {
        notification.data = {};
      }
    }

    return notification;
  },

  // ===== OBTENER NOTIFICACIONES DEL USUARIO =====
  getByUser: (userId, options = {}) => {
    let query = 'SELECT * FROM notifications WHERE id_user = ?';
    const params = [userId];
    const conditions = [];

    if (options.unread) {
      conditions.push('read_at IS NULL');
    }

    if (options.type) {
      conditions.push('type = ?');
      params.push(options.type);
    }

    if (options.priority) {
      conditions.push('priority = ?');
      params.push(options.priority);
    }

    if (options.not_expired) {
      conditions.push("(expires_at IS NULL OR expires_at > datetime('now'))");
    }

    if (conditions.length > 0) {
      query += ` AND ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY priority DESC, created_at DESC';

    if (options.limit) {
      query += ` LIMIT ${options.limit}`;
    }

    const stmt = db.prepare(query);
    const notifications = stmt.all(...params);

    // Parsear datos JSON
    return notifications.map(notification => {
      if (notification.data) {
        try {
          notification.data = JSON.parse(notification.data);
        } catch {
          notification.data = {};
        }
      }
      return notification;
    });
  },

  // ===== OBTENER NOTIFICACIONES PENDIENTES (PARA MOSTRAR) =====
  getPending: userId => {
    const stmt = db.prepare(`
      SELECT * FROM notifications 
      WHERE id_user = ? 
        AND read_at IS NULL 
        AND (scheduled_for IS NULL OR scheduled_for <= datetime('now'))
        AND (expires_at IS NULL OR expires_at > datetime('now'))
      ORDER BY priority DESC, created_at DESC
    `);

    const notifications = stmt.all(userId);

    // Parsear datos JSON
    return notifications.map(notification => {
      if (notification.data) {
        try {
          notification.data = JSON.parse(notification.data);
        } catch {
          notification.data = {};
        }
      }
      return notification;
    });
  },

  // ===== MARCAR COMO LEÍDA =====
  markAsRead: id => {
    const stmt = db.prepare(`
      UPDATE notifications 
      SET read_at = datetime('now')
      WHERE id = ? AND read_at IS NULL
    `);

    const result = stmt.run(id);
    return result.changes > 0;
  },

  // ===== MARCAR MÚLTIPLES COMO LEÍDAS =====
  markMultipleAsRead: ids => {
    if (ids.length === 0) {
      return 0;
    }

    const placeholders = ids.map(() => '?').join(',');
    const stmt = db.prepare(`
      UPDATE notifications 
      SET read_at = datetime('now')
      WHERE id IN (${placeholders}) AND read_at IS NULL
    `);

    const result = stmt.run(...ids);
    return result.changes;
  },

  // ===== MARCAR TODAS COMO LEÍDAS (POR USUARIO) =====
  markAllAsRead: userId => {
    const stmt = db.prepare(`
      UPDATE notifications 
      SET read_at = datetime('now')
      WHERE id_user = ? AND read_at IS NULL
    `);

    const result = stmt.run(userId);
    return result.changes;
  },

  // ===== ELIMINAR NOTIFICACIÓN =====
  delete: id => {
    const stmt = db.prepare('DELETE FROM notifications WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // ===== ELIMINAR NOTIFICACIONES EXPIRADAS =====
  deleteExpired: () => {
    const stmt = db.prepare(`
      DELETE FROM notifications 
      WHERE expires_at IS NOT NULL AND expires_at <= datetime('now')
    `);

    const result = stmt.run();
    return result.changes;
  },

  // ===== ELIMINAR NOTIFICACIONES ANTIGUAS LEÍDAS =====
  deleteOldRead: (daysOld = 30) => {
    const stmt = db.prepare(`
      DELETE FROM notifications 
      WHERE read_at IS NOT NULL 
        AND read_at <= datetime('now', '-${daysOld} days')
    `);

    const result = stmt.run();
    return result.changes;
  },

  // ===== PROGRAMAR NOTIFICACIÓN =====
  schedule: (notificationData, scheduledFor) => {
    return NotificationRepository.create({
      ...notificationData,
      scheduled_for: scheduledFor,
    });
  },

  // ===== OBTENER NOTIFICACIONES PROGRAMADAS =====
  getScheduled: (options = {}) => {
    let query = `
      SELECT * FROM notifications 
      WHERE scheduled_for > datetime('now')
    `;
    const params = [];

    if (options.userId) {
      query += ' AND id_user = ?';
      params.push(options.userId);
    }

    if (options.type) {
      query += ' AND type = ?';
      params.push(options.type);
    }

    query += ' ORDER BY scheduled_for ASC';

    if (options.limit) {
      query += ` LIMIT ${options.limit}`;
    }

    const stmt = db.prepare(query);
    const notifications = stmt.all(...params);

    // Parsear datos JSON
    return notifications.map(notification => {
      if (notification.data) {
        try {
          notification.data = JSON.parse(notification.data);
        } catch {
          notification.data = {};
        }
      }
      return notification;
    });
  },

  // ===== OBTENER ESTADÍSTICAS DE NOTIFICACIONES =====
  getStatistics: userId => {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE id_user = ?');
    const unreadStmt = db.prepare(
      'SELECT COUNT(*) as count FROM notifications WHERE id_user = ? AND read_at IS NULL',
    );
    const byTypeStmt = db.prepare(`
      SELECT type, COUNT(*) as count 
      FROM notifications 
      WHERE id_user = ? 
      GROUP BY type 
      ORDER BY count DESC
    `);
    const byPriorityStmt = db.prepare(`
      SELECT priority, COUNT(*) as count 
      FROM notifications 
      WHERE id_user = ? AND read_at IS NULL
      GROUP BY priority 
      ORDER BY 
        CASE priority 
          WHEN 'high' THEN 1 
          WHEN 'normal' THEN 2 
          WHEN 'low' THEN 3 
        END
    `);

    const total = totalStmt.get(userId);
    const unread = unreadStmt.get(userId);
    const byType = byTypeStmt.all(userId);
    const byPriority = byPriorityStmt.all(userId);

    return {
      total: total.count,
      unread: unread.count,
      read: total.count - unread.count,
      by_type: byType,
      by_priority: byPriority,
    };
  },

  // ===== CREAR NOTIFICACIÓN DE NUEVO CÓCTEL =====
  createCocktailNotification: (userId, cocktailData) => {
    return NotificationRepository.create({
      id_user: userId,
      type: 'new_cocktail',
      title: '¡Nuevo cóctel agregado!',
      message: `Se ha agregado "${cocktailData.name}" al catálogo`,
      data: {
        cocktail_id: cocktailData.id,
        cocktail_name: cocktailData.name,
        difficulty: cocktailData.difficulty,
      },
      priority: 'normal',
    });
  },

  // ===== CREAR NOTIFICACIÓN DE RECORDATORIO =====
  createReminderNotification: (userId, reminderData) => {
    return NotificationRepository.create({
      id_user: userId,
      type: 'reminder',
      title: reminderData.title || 'Recordatorio',
      message: reminderData.message,
      data: reminderData.data || {},
      scheduled_for: reminderData.scheduled_for,
      priority: reminderData.priority || 'normal',
      expires_at: reminderData.expires_at,
    });
  },

  // ===== CREAR NOTIFICACIÓN DE LOGRO =====
  createAchievementNotification: (userId, achievementData) => {
    return NotificationRepository.create({
      id_user: userId,
      type: 'achievement',
      title: '¡Logro desbloqueado!',
      message: achievementData.message,
      data: {
        achievement_type: achievementData.type,
        achievement_data: achievementData.data,
      },
      priority: 'high',
    });
  },

  // ===== CREAR NOTIFICACIÓN DEL SISTEMA =====
  createSystemNotification: (userId, systemData) => {
    return NotificationRepository.create({
      id_user: userId,
      type: 'system',
      title: systemData.title || 'Notificación del sistema',
      message: systemData.message,
      data: systemData.data || {},
      priority: systemData.priority || 'normal',
      expires_at: systemData.expires_at,
    });
  },

  // ===== BUSCAR NOTIFICACIONES =====
  search: (searchTerm, options = {}) => {
    let query = `
      SELECT * FROM notifications 
      WHERE (title LIKE ? OR message LIKE ?)
    `;
    const params = [`%${searchTerm}%`, `%${searchTerm}%`];

    if (options.userId) {
      query += ' AND id_user = ?';
      params.push(options.userId);
    }

    if (options.type) {
      query += ' AND type = ?';
      params.push(options.type);
    }

    if (options.unread) {
      query += ' AND read_at IS NULL';
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ` LIMIT ${options.limit}`;
    }

    const stmt = db.prepare(query);
    const notifications = stmt.all(...params);

    // Parsear datos JSON
    return notifications.map(notification => {
      if (notification.data) {
        try {
          notification.data = JSON.parse(notification.data);
        } catch {
          notification.data = {};
        }
      }
      return notification;
    });
  },

  // ===== CONTAR NOTIFICACIONES NO LEÍDAS =====
  countUnread: userId => {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count 
      FROM notifications 
      WHERE id_user = ? 
        AND read_at IS NULL 
        AND (expires_at IS NULL OR expires_at > datetime('now'))
    `);

    const result = stmt.get(userId);
    return result.count;
  },
};

export default NotificationRepository;
