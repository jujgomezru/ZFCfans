import db from './database.js';

// ================================
// REPOSITORIO DE CATEGORÍAS
// ================================

const CategoryRepository = {
  // ===== CREAR CATEGORÍA =====
  create: categoryData => {
    const stmt = db.prepare(`
      INSERT INTO categories (name, description, color, is_system, id_owner)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      categoryData.name,
      categoryData.description || null,
      categoryData.color || '#6B7280',
      categoryData.is_system || 0,
      categoryData.id_owner || null,
    );

    return result.lastInsertRowid;
  },

  // ===== OBTENER TODAS LAS CATEGORÍAS =====
  getAll: (options = {}) => {
    let query = `
      SELECT 
        c.*,
        u.username as owner_name,
        COUNT(cc.id_cocktail) as cocktail_count
      FROM categories c
      LEFT JOIN users u ON c.id_owner = u.id
      LEFT JOIN cocktail_categories cc ON c.id = cc.id_category
    `;

    const conditions = [];
    const params = [];

    if (options.is_system !== undefined) {
      conditions.push('c.is_system = ?');
      params.push(options.is_system);
    }

    if (options.owner_id) {
      conditions.push('c.id_owner = ?');
      params.push(options.owner_id);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' GROUP BY c.id ORDER BY c.is_system DESC, c.name ASC';

    const stmt = db.prepare(query);
    return stmt.all(...params);
  },

  // ===== OBTENER CATEGORÍA POR ID =====
  getById: id => {
    const stmt = db.prepare(`
      SELECT 
        c.*,
        u.username as owner_name,
        COUNT(cc.id_cocktail) as cocktail_count
      FROM categories c
      LEFT JOIN users u ON c.id_owner = u.id
      LEFT JOIN cocktail_categories cc ON c.id = cc.id_category
      WHERE c.id = ?
      GROUP BY c.id
    `);

    return stmt.get(id);
  },

  // ===== OBTENER CATEGORÍAS DEL SISTEMA =====
  getSystemCategories: () => {
    const stmt = db.prepare(`
      SELECT 
        c.*,
        COUNT(cc.id_cocktail) as cocktail_count
      FROM categories c
      LEFT JOIN cocktail_categories cc ON c.id = cc.id_category
      WHERE c.is_system = 1
      GROUP BY c.id
      ORDER BY c.name
    `);

    return stmt.all();
  },

  // ===== OBTENER CATEGORÍAS PERSONALIZADAS =====
  getUserCategories: userId => {
    const stmt = db.prepare(`
      SELECT 
        c.*,
        COUNT(cc.id_cocktail) as cocktail_count
      FROM categories c
      LEFT JOIN cocktail_categories cc ON c.id = cc.id_category
      WHERE c.is_system = 0 AND (c.id_owner = ? OR c.id_owner IS NULL)
      GROUP BY c.id
      ORDER BY c.name
    `);

    return stmt.all(userId);
  },

  // ===== ACTUALIZAR CATEGORÍA =====
  update: (id, categoryData) => {
    const fields = [];
    const params = [];

    Object.keys(categoryData).forEach(key => {
      if (categoryData[key] !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        params.push(categoryData[key]);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    fields.push("updated_at = datetime('now')");
    params.push(id);

    const stmt = db.prepare(`
      UPDATE categories 
      SET ${fields.join(', ')} 
      WHERE id = ? AND is_system = 0
    `);

    const result = stmt.run(...params);
    return result.changes > 0;
  },

  // ===== ELIMINAR CATEGORÍA =====
  delete: id => {
    // Solo permitir eliminar categorías no del sistema
    const stmt = db.prepare('DELETE FROM categories WHERE id = ? AND is_system = 0');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // ===== AGREGAR CÓCTEL A CATEGORÍA =====
  addCocktail: (categoryId, cocktailId) => {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO cocktail_categories (id_cocktail, id_category)
      VALUES (?, ?)
    `);

    const result = stmt.run(cocktailId, categoryId);
    return result.changes > 0;
  },

  // ===== REMOVER CÓCTEL DE CATEGORÍA =====
  removeCocktail: (categoryId, cocktailId) => {
    const stmt = db.prepare(`
      DELETE FROM cocktail_categories 
      WHERE id_cocktail = ? AND id_category = ?
    `);

    const result = stmt.run(cocktailId, categoryId);
    return result.changes > 0;
  },

  // ===== OBTENER CÓCTELES DE UNA CATEGORÍA =====
  getCocktails: categoryId => {
    const stmt = db.prepare(`
      SELECT DISTINCT c.*, cc.added_at
      FROM cocktails c
      JOIN cocktail_categories cc ON c.id = cc.id_cocktail
      WHERE cc.id_category = ?
      ORDER BY cc.added_at DESC
    `);

    return stmt.all(categoryId);
  },

  // ===== BUSCAR CATEGORÍAS =====
  search: searchTerm => {
    const searchPattern = `%${searchTerm}%`;
    const stmt = db.prepare(`
      SELECT 
        c.*,
        u.username as owner_name,
        COUNT(cc.id_cocktail) as cocktail_count
      FROM categories c
      LEFT JOIN users u ON c.id_owner = u.id
      LEFT JOIN cocktail_categories cc ON c.id = cc.id_category
      WHERE c.name LIKE ? OR c.description LIKE ?
      GROUP BY c.id
      ORDER BY c.name
    `);

    return stmt.all(searchPattern, searchPattern);
  },

  // ===== VERIFICAR SI CATEGORÍA EXISTE =====
  exists: (name, excludeId = null) => {
    let query = 'SELECT id FROM categories WHERE name = ?';
    const params = [name];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const stmt = db.prepare(query);
    const result = stmt.get(...params);
    return !!result;
  },

  // ===== ESTADÍSTICAS DE CATEGORÍAS =====
  getStats: () => {
    const systemStmt = db.prepare(`
      SELECT COUNT(*) as count 
      FROM categories 
      WHERE is_system = 1
    `);

    const userStmt = db.prepare(`
      SELECT COUNT(*) as count 
      FROM categories 
      WHERE is_system = 0
    `);

    const popularStmt = db.prepare(`
      SELECT 
        c.name,
        c.color,
        COUNT(cc.id_cocktail) as cocktail_count
      FROM categories c
      LEFT JOIN cocktail_categories cc ON c.id = cc.id_category
      GROUP BY c.id
      ORDER BY cocktail_count DESC
      LIMIT 5
    `);

    return {
      systemCategories: systemStmt.get().count,
      userCategories: userStmt.get().count,
      mostPopular: popularStmt.all(),
    };
  },
};

export default CategoryRepository;
