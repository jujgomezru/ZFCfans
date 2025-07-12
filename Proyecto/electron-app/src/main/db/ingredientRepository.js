import db from './database.js';

// ================================
// REPOSITORIO DE INGREDIENTES
// ================================

const IngredientRepository = {
  // ===== CREAR INGREDIENTE =====
  create: ingredientData => {
    const stmt = db.prepare(`
      INSERT INTO ingredients (name, type, category, description, alcohol_content)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      ingredientData.name,
      ingredientData.type,
      ingredientData.category || null,
      ingredientData.description || null,
      ingredientData.alcohol_content || 0,
    );

    return result.lastInsertRowid;
  },

  // ===== OBTENER TODOS LOS INGREDIENTES =====
  getAll: (options = {}) => {
    let query = `
      SELECT 
        i.*,
        COUNT(ri.id_recipe) as usage_count
      FROM ingredients i
      LEFT JOIN recipe_ingredients ri ON i.id = ri.id_ingredient
    `;

    const conditions = [];
    const params = [];

    if (options.type) {
      conditions.push('i.type = ?');
      params.push(options.type);
    }

    if (options.category) {
      conditions.push('i.category = ?');
      params.push(options.category);
    }

    if (options.search) {
      conditions.push('(i.name LIKE ? OR i.description LIKE ?)');
      params.push(`%${options.search}%`, `%${options.search}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' GROUP BY i.id';

    // Ordenamiento
    switch (options.orderBy) {
      case 'name':
        query += ' ORDER BY i.name ASC';
        break;
      case 'type':
        query += ' ORDER BY i.type ASC, i.name ASC';
        break;
      case 'category':
        query += ' ORDER BY i.category ASC, i.name ASC';
        break;
      case 'usage':
        query += ' ORDER BY usage_count DESC, i.name ASC';
        break;
      default:
        query += ' ORDER BY i.name ASC';
    }

    if (options.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
    }

    const stmt = db.prepare(query);
    return stmt.all(...params);
  },

  // ===== OBTENER INGREDIENTE POR ID =====
  getById: id => {
    const stmt = db.prepare(`
      SELECT 
        i.*,
        COUNT(ri.id_recipe) as usage_count
      FROM ingredients i
      LEFT JOIN recipe_ingredients ri ON i.id = ri.id_ingredient
      WHERE i.id = ?
      GROUP BY i.id
    `);

    return stmt.get(id);
  },

  // ===== OBTENER INGREDIENTES POR CATEGORÍA =====
  getByCategory: category => {
    const stmt = db.prepare(`
      SELECT 
        i.*,
        COUNT(ri.id_recipe) as usage_count
      FROM ingredients i
      LEFT JOIN recipe_ingredients ri ON i.id = ri.id_ingredient
      WHERE i.category = ?
      GROUP BY i.id
      ORDER BY i.name
    `);

    return stmt.all(category);
  },

  // ===== OBTENER INGREDIENTES POR TIPO =====
  getByType: type => {
    const stmt = db.prepare(`
      SELECT 
        i.*,
        COUNT(ri.id_recipe) as usage_count
      FROM ingredients i
      LEFT JOIN recipe_ingredients ri ON i.id = ri.id_ingredient
      WHERE i.type = ?
      GROUP BY i.id
      ORDER BY i.name
    `);

    return stmt.all(type);
  },

  // ===== OBTENER INGREDIENTES ALCOHÓLICOS =====
  getAlcoholic: () => {
    const stmt = db.prepare(`
      SELECT 
        i.*,
        COUNT(ri.id_recipe) as usage_count
      FROM ingredients i
      LEFT JOIN recipe_ingredients ri ON i.id = ri.id_ingredient
      WHERE i.alcohol_content > 0
      GROUP BY i.id
      ORDER BY i.alcohol_content DESC, i.name
    `);

    return stmt.all();
  },

  // ===== OBTENER INGREDIENTES NO ALCOHÓLICOS =====
  getNonAlcoholic: () => {
    const stmt = db.prepare(`
      SELECT 
        i.*,
        COUNT(ri.id_recipe) as usage_count
      FROM ingredients i
      LEFT JOIN recipe_ingredients ri ON i.id = ri.id_ingredient
      WHERE i.alcohol_content = 0
      GROUP BY i.id
      ORDER BY i.category, i.name
    `);

    return stmt.all();
  },

  // ===== ACTUALIZAR INGREDIENTE =====
  update: (id, ingredientData) => {
    const fields = [];
    const params = [];

    Object.keys(ingredientData).forEach(key => {
      if (ingredientData[key] !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        params.push(ingredientData[key]);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    params.push(id);

    const stmt = db.prepare(`
      UPDATE ingredients 
      SET ${fields.join(', ')} 
      WHERE id = ?
    `);

    const result = stmt.run(...params);
    return result.changes > 0;
  },

  // ===== ELIMINAR INGREDIENTE =====
  delete: id => {
    // Verificar si el ingrediente está siendo usado
    const usageStmt = db.prepare(
      'SELECT COUNT(*) as count FROM recipe_ingredients WHERE id_ingredient = ?',
    );
    const usage = usageStmt.get(id);

    if (usage.count > 0) {
      return { success: false, reason: 'INGREDIENT_IN_USE', usageCount: usage.count };
    }

    const stmt = db.prepare('DELETE FROM ingredients WHERE id = ?');
    const result = stmt.run(id);

    return { success: result.changes > 0 };
  },

  // ===== BUSCAR INGREDIENTES =====
  search: (searchTerm, options = {}) => {
    const searchPattern = `%${searchTerm}%`;
    let query = `
      SELECT 
        i.*,
        COUNT(ri.id_recipe) as usage_count
      FROM ingredients i
      LEFT JOIN recipe_ingredients ri ON i.id = ri.id_ingredient
      WHERE (i.name LIKE ? OR i.description LIKE ?)
    `;

    const params = [searchPattern, searchPattern];

    if (options.type) {
      query += ' AND i.type = ?';
      params.push(options.type);
    }

    if (options.category) {
      query += ' AND i.category = ?';
      params.push(options.category);
    }

    query += ' GROUP BY i.id ORDER BY i.name';

    if (options.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
    }

    const stmt = db.prepare(query);
    return stmt.all(...params);
  },

  // ===== OBTENER CATEGORÍAS DE INGREDIENTES =====
  getCategories: () => {
    const stmt = db.prepare(`
      SELECT 
        category,
        COUNT(*) as ingredient_count
      FROM ingredients 
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY category
    `);

    return stmt.all();
  },

  // ===== OBTENER INGREDIENTES MÁS USADOS =====
  getMostUsed: (limit = 10) => {
    const stmt = db.prepare(`
      SELECT 
        i.*,
        COUNT(ri.id_recipe) as usage_count
      FROM ingredients i
      JOIN recipe_ingredients ri ON i.id = ri.id_ingredient
      GROUP BY i.id
      ORDER BY usage_count DESC, i.name
      LIMIT ?
    `);

    return stmt.all(limit);
  },

  // ===== OBTENER INGREDIENTES ESENCIALES =====
  getEssential: () => {
    const stmt = db.prepare(`
      SELECT 
        i.*,
        COUNT(ri.id_recipe) as usage_count
      FROM ingredients i
      LEFT JOIN recipe_ingredients ri ON i.id = ri.id_ingredient
      WHERE i.type = 'esencial'
      GROUP BY i.id
      ORDER BY usage_count DESC, i.name
    `);

    return stmt.all();
  },

  // ===== VERIFICAR SI INGREDIENTE EXISTE =====
  exists: (name, excludeId = null) => {
    let query = 'SELECT id FROM ingredients WHERE name = ?';
    const params = [name];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const stmt = db.prepare(query);
    const result = stmt.get(...params);
    return !!result;
  },

  // ===== OBTENER RECETAS QUE USAN UN INGREDIENTE =====
  getRecipesUsing: ingredientId => {
    const stmt = db.prepare(`
      SELECT 
        c.id,
        c.name,
        c.difficulty,
        ri.quantity,
        ri.unit,
        ri.preparation_note
      FROM cocktails c
      JOIN recipes r ON c.id = r.id_cocktail
      JOIN recipe_ingredients ri ON r.id = ri.id_recipe
      WHERE ri.id_ingredient = ?
      ORDER BY c.name
    `);

    return stmt.all(ingredientId);
  },

  // ===== ESTADÍSTICAS DE INGREDIENTES =====
  getStats: () => {
    const totalStmt = db.prepare('SELECT COUNT(*) as total FROM ingredients');
    const typeStmt = db.prepare(`
      SELECT type, COUNT(*) as count 
      FROM ingredients 
      GROUP BY type
    `);
    const categoryStmt = db.prepare(`
      SELECT category, COUNT(*) as count
      FROM ingredients 
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `);
    const alcoholStmt = db.prepare(`
      SELECT 
        CASE 
          WHEN alcohol_content = 0 THEN 'Sin alcohol'
          WHEN alcohol_content > 0 AND alcohol_content <= 15 THEN 'Bajo (≤15%)'
          WHEN alcohol_content > 15 AND alcohol_content <= 40 THEN 'Medio (16-40%)'
          ELSE 'Alto (>40%)'
        END as alcohol_range,
        COUNT(*) as count
      FROM ingredients
      GROUP BY alcohol_range
      ORDER BY count DESC
    `);

    return {
      total: totalStmt.get().total,
      byType: typeStmt.all(),
      byCategory: categoryStmt.all(),
      byAlcoholContent: alcoholStmt.all(),
    };
  },
};

export default IngredientRepository;
