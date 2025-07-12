import db from './database.js';

// ================================
// REPOSITORIO DE USUARIOS
// ================================

const UserRepository = {
  // ===== CREAR USUARIO =====
  create: userData => {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, preferences, experience_level, age)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    try {
      const result = stmt.run(
        userData.name,
        userData.email,
        userData.password_hash,
        typeof userData.preferences === 'object'
          ? JSON.stringify(userData.preferences)
          : userData.preferences,
        userData.experience_level || 'principiante',
        userData.age || null,
      );

      return result.lastInsertRowid;
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('El email ya está registrado');
      }
      throw error;
    }
  },

  // ===== OBTENER USUARIO POR ID =====
  getById: id => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id);

    if (user && user.preferences) {
      try {
        user.preferences = JSON.parse(user.preferences);
      } catch {
        user.preferences = {};
      }
    }

    return user;
  },

  // ===== OBTENER USUARIO POR EMAIL =====
  getByEmail: email => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    if (user && user.preferences) {
      try {
        user.preferences = JSON.parse(user.preferences);
      } catch {
        user.preferences = {};
      }
    }

    return user;
  },

  // ===== OBTENER TODOS LOS USUARIOS =====
  getAll: (options = {}) => {
    let query = 'SELECT * FROM users';
    const params = [];
    const conditions = [];

    if (options.experience_level) {
      conditions.push('experience_level = ?');
      params.push(options.experience_level);
    }

    if (options.active !== undefined) {
      conditions.push('active = ?');
      params.push(options.active ? 1 : 0);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY name';

    if (options.limit) {
      query += ` LIMIT ${options.limit}`;
    }

    const stmt = db.prepare(query);
    const users = stmt.all(...params);

    // Parsear preferencias
    return users.map(user => {
      if (user.preferences) {
        try {
          user.preferences = JSON.parse(user.preferences);
        } catch {
          user.preferences = {};
        }
      }
      return user;
    });
  },

  // ===== ACTUALIZAR USUARIO =====
  update: (id, userData) => {
    const fields = [];
    const params = [];

    Object.keys(userData).forEach(key => {
      if (userData[key] !== undefined && key !== 'id') {
        if (key === 'preferences') {
          fields.push(`${key} = ?`);
          params.push(
            typeof userData[key] === 'object' ? JSON.stringify(userData[key]) : userData[key],
          );
        } else {
          fields.push(`${key} = ?`);
          params.push(userData[key]);
        }
      }
    });

    if (fields.length === 0) {
      return false;
    }

    fields.push("updated_at = datetime('now')");
    params.push(id);

    const stmt = db.prepare(`
      UPDATE users 
      SET ${fields.join(', ')} 
      WHERE id = ?
    `);

    try {
      const result = stmt.run(...params);
      return result.changes > 0;
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('El email ya está registrado');
      }
      throw error;
    }
  },

  // ===== ACTUALIZAR PREFERENCIAS =====
  updatePreferences: (id, preferences) => {
    const stmt = db.prepare(`
      UPDATE users 
      SET preferences = ?, updated_at = datetime('now')
      WHERE id = ?
    `);

    const result = stmt.run(JSON.stringify(preferences), id);
    return result.changes > 0;
  },

  // ===== OBTENER PREFERENCIAS =====
  getPreferences: id => {
    const stmt = db.prepare('SELECT preferences FROM users WHERE id = ?');
    const result = stmt.get(id);

    if (!result || !result.preferences) {
      return {};
    }

    try {
      return JSON.parse(result.preferences);
    } catch {
      return {};
    }
  },

  // ===== CAMBIAR CONTRASEÑA =====
  changePassword: (id, newPasswordHash) => {
    const stmt = db.prepare(`
      UPDATE users 
      SET password_hash = ?, updated_at = datetime('now')
      WHERE id = ?
    `);

    const result = stmt.run(newPasswordHash, id);
    return result.changes > 0;
  },

  // ===== ACTIVAR/DESACTIVAR USUARIO =====
  setActive: (id, active) => {
    const stmt = db.prepare(`
      UPDATE users 
      SET active = ?, updated_at = datetime('now')
      WHERE id = ?
    `);

    const result = stmt.run(active ? 1 : 0, id);
    return result.changes > 0;
  },

  // ===== ELIMINAR USUARIO =====
  delete: id => {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // ===== BUSCAR USUARIOS =====
  search: (searchTerm, options = {}) => {
    let query = `
      SELECT * FROM users 
      WHERE (name LIKE ? OR email LIKE ?)
    `;
    const params = [`%${searchTerm}%`, `%${searchTerm}%`];

    if (options.experience_level) {
      query += ' AND experience_level = ?';
      params.push(options.experience_level);
    }

    if (options.active !== undefined) {
      query += ' AND active = ?';
      params.push(options.active ? 1 : 0);
    }

    query += ' ORDER BY name';

    if (options.limit) {
      query += ` LIMIT ${options.limit}`;
    }

    const stmt = db.prepare(query);
    const users = stmt.all(...params);

    // Parsear preferencias
    return users.map(user => {
      if (user.preferences) {
        try {
          user.preferences = JSON.parse(user.preferences);
        } catch {
          user.preferences = {};
        }
      }
      return user;
    });
  },

  // ===== OBTENER ESTADÍSTICAS DE USUARIO =====
  getStatistics: id => {
    // Cócteles favoritos
    const favoritesStmt = db.prepare(`
      SELECT COUNT(*) as count FROM cocktail_categories cc
      JOIN categories cat ON cc.id_category = cat.id
      WHERE cc.id_cocktail IN (
        SELECT id_cocktail FROM user_cocktail_history 
        WHERE id_user = ?
      ) AND cat.is_system = 1 AND cat.name = 'Favoritos'
    `);

    // Historial de preparaciones
    const historyStmt = db.prepare(`
      SELECT COUNT(*) as total_preparations,
             COUNT(DISTINCT id_cocktail) as unique_cocktails,
             AVG(rating) as avg_rating
      FROM user_cocktail_history 
      WHERE id_user = ?
    `);

    // Nivel de experiencia basado en preparaciones
    const experienceStmt = db.prepare(`
      SELECT 
        COUNT(*) as total_preparations,
        COUNT(CASE WHEN rating >= 4 THEN 1 END) as good_preparations,
        COUNT(DISTINCT id_cocktail) as unique_cocktails
      FROM user_cocktail_history 
      WHERE id_user = ?
    `);

    const favorites = favoritesStmt.get(id);
    const history = historyStmt.get(id);
    const experience = experienceStmt.get(id);

    return {
      favorites_count: favorites.count || 0,
      total_preparations: history.total_preparations || 0,
      unique_cocktails: history.unique_cocktails || 0,
      average_rating: history.avg_rating || 0,
      success_rate:
        experience.total_preparations > 0
          ? (experience.good_preparations / experience.total_preparations) * 100
          : 0,
      experience_level: calculateExperienceLevel(experience),
    };
  },

  // ===== OBTENER CÓCTELES FAVORITOS DEL USUARIO =====
  getFavorites: id => {
    const stmt = db.prepare(`
      SELECT 
        c.*,
        uch.rating,
        uch.preparation_date,
        uch.notes
      FROM cocktails c
      JOIN cocktail_categories cc ON c.id = cc.id_cocktail
      JOIN categories cat ON cc.id_category = cat.id
      LEFT JOIN user_cocktail_history uch ON c.id = uch.id_cocktail AND uch.id_user = ?
      WHERE cat.is_system = 1 AND cat.name = 'Favoritos'
      ORDER BY uch.preparation_date DESC, c.name
    `);

    return stmt.all(id);
  },

  // ===== OBTENER HISTORIAL DEL USUARIO =====
  getHistory: (id, options = {}) => {
    let query = `
      SELECT 
        uch.*,
        c.name as cocktail_name,
        c.difficulty as cocktail_difficulty,
        c.description as cocktail_description
      FROM user_cocktail_history uch
      JOIN cocktails c ON uch.id_cocktail = c.id
      WHERE uch.id_user = ?
    `;
    const params = [id];

    if (options.rating) {
      query += ' AND uch.rating >= ?';
      params.push(options.rating);
    }

    if (options.from_date) {
      query += ' AND uch.preparation_date >= ?';
      params.push(options.from_date);
    }

    if (options.to_date) {
      query += ' AND uch.preparation_date <= ?';
      params.push(options.to_date);
    }

    query += ' ORDER BY uch.preparation_date DESC';

    if (options.limit) {
      query += ` LIMIT ${options.limit}`;
    }

    const stmt = db.prepare(query);
    return stmt.all(...params);
  },

  // ===== AGREGAR PREPARACIÓN AL HISTORIAL =====
  addToHistory: (userId, cocktailId, historyData) => {
    const stmt = db.prepare(`
      INSERT INTO user_cocktail_history 
      (id_user, id_cocktail, preparation_date, rating, notes, duration, success)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      userId,
      cocktailId,
      historyData.preparation_date || new Date().toISOString(),
      historyData.rating || null,
      historyData.notes || null,
      historyData.duration || null,
      historyData.success !== undefined ? historyData.success : 1,
    );

    return result.lastInsertRowid;
  },

  // ===== VALIDAR CREDENCIALES =====
  validateCredentials: (email, passwordHash) => {
    const stmt = db.prepare(`
      SELECT * FROM users 
      WHERE email = ? AND password_hash = ? AND active = 1
    `);

    const user = stmt.get(email, passwordHash);

    if (user && user.preferences) {
      try {
        user.preferences = JSON.parse(user.preferences);
      } catch {
        user.preferences = {};
      }
    }

    return user;
  },

  // ===== OBTENER USUARIOS POR NIVEL DE EXPERIENCIA =====
  getByExperienceLevel: level => {
    const stmt = db.prepare(`
      SELECT * FROM users 
      WHERE experience_level = ? AND active = 1
      ORDER BY name
    `);

    return stmt.all(level);
  },

  // ===== CONTAR USUARIOS =====
  count: (options = {}) => {
    let query = 'SELECT COUNT(*) as count FROM users';
    const params = [];
    const conditions = [];

    if (options.active !== undefined) {
      conditions.push('active = ?');
      params.push(options.active ? 1 : 0);
    }

    if (options.experience_level) {
      conditions.push('experience_level = ?');
      params.push(options.experience_level);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const stmt = db.prepare(query);
    const result = stmt.get(...params);
    return result.count;
  },
};

// ===== FUNCIÓN AUXILIAR PARA CALCULAR NIVEL DE EXPERIENCIA =====
const calculateExperienceLevel = stats => {
  const { total_preparations, unique_cocktails, good_preparations } = stats;

  if (total_preparations === 0) {
    return 'principiante';
  }

  const successRate = good_preparations / total_preparations;

  if (total_preparations >= 50 && unique_cocktails >= 20 && successRate >= 0.8) {
    return 'experto';
  } else if (total_preparations >= 20 && unique_cocktails >= 10 && successRate >= 0.7) {
    return 'intermedio';
  } else if (total_preparations >= 5 && successRate >= 0.6) {
    return 'novato';
  }

  return 'principiante';
};

export default UserRepository;
