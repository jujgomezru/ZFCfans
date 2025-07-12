import db from './database.js';

// ================================
// REPOSITORIO DE CÓCTELES MODERNIZADO
// ================================

const CocktailRepository = {
  // ===== CREAR CÓCTEL =====
  create: cocktailData => {
    const stmt = db.prepare(`
      INSERT INTO cocktails (
        name, img_url, difficulty, description, additional_notes,
        preparation_time, servings, alcohol_content, is_featured,
        id_owner, id_pairing, id_category
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      cocktailData.name,
      cocktailData.img_url || null,
      cocktailData.difficulty,
      cocktailData.description || null,
      cocktailData.additional_notes || null,
      cocktailData.preparation_time || null,
      cocktailData.servings || 1,
      cocktailData.alcohol_content || null,
      cocktailData.is_featured || 0,
      cocktailData.id_owner || null,
      cocktailData.id_pairing || null,
      cocktailData.id_category || null,
    );

    return result.lastInsertRowid;
  },

  // ===== OBTENER TODOS LOS CÓCTELES =====
  getAll: (options = {}) => {
    let query = `
      SELECT 
        c.*,
        cat.name as category_name,
        cat.color as category_color,
        p.name as pairing_name,
        u.username as owner_name
      FROM cocktails c
      LEFT JOIN categories cat ON c.id_category = cat.id
      LEFT JOIN pairings p ON c.id_pairing = p.id
      LEFT JOIN users u ON c.id_owner = u.id
    `;

    const conditions = [];
    const params = [];

    // Filtros opcionales
    if (options.difficulty) {
      conditions.push('c.difficulty = ?');
      params.push(options.difficulty);
    }

    if (options.category_id) {
      conditions.push('c.id_category = ?');
      params.push(options.category_id);
    }

    if (options.is_featured !== undefined) {
      conditions.push('c.is_featured = ?');
      params.push(options.is_featured);
    }

    if (options.search) {
      conditions.push('(c.name LIKE ? OR c.description LIKE ?)');
      params.push(`%${options.search}%`, `%${options.search}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Ordenamiento
    query += ' ORDER BY ';
    switch (options.orderBy) {
      case 'name':
        query += 'c.name ASC';
        break;
      case 'difficulty':
        query += 'c.difficulty ASC';
        break;
      case 'preparation_time':
        query += 'c.preparation_time ASC';
        break;
      default:
        query += 'c.created_at DESC';
    }

    // Limit
    if (options.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
    }

    const stmt = db.prepare(query);
    return stmt.all(...params);
  },

  // ===== OBTENER CÓCTEL POR ID =====
  getById: id => {
    const stmt = db.prepare(`
      SELECT 
        c.*,
        cat.name as category_name,
        cat.color as category_color,
        p.name as pairing_name,
        p.description as pairing_description,
        u.username as owner_name
      FROM cocktails c
      LEFT JOIN categories cat ON c.id_category = cat.id
      LEFT JOIN pairings p ON c.id_pairing = p.id
      LEFT JOIN users u ON c.id_owner = u.id
      WHERE c.id = ?
    `);

    return stmt.get(id);
  },

  // ===== OBTENER CÓCTEL CON RECETA COMPLETA =====
  getWithRecipe: id => {
    const cocktail = CocktailRepository.getById(id);
    if (!cocktail) {
      return null;
    }

    // Obtener receta
    const recipe = db.prepare('SELECT * FROM recipes WHERE id_cocktail = ?').get(id);

    if (recipe) {
      // Obtener pasos de la receta
      const steps = db
        .prepare(
          `
        SELECT * FROM recipe_steps 
        WHERE id_recipe = ? 
        ORDER BY step_number
      `,
        )
        .all(recipe.id);

      // Obtener ingredientes
      const ingredients = db
        .prepare(
          `
        SELECT 
          ri.*,
          i.name as ingredient_name,
          i.type as ingredient_type,
          i.category as ingredient_category,
          i.alcohol_content as ingredient_alcohol
        FROM recipe_ingredients ri
        JOIN ingredients i ON ri.id_ingredient = i.id
        WHERE ri.id_recipe = ?
        ORDER BY ri.order_index, i.name
      `,
        )
        .all(recipe.id);

      cocktail.recipe = {
        ...recipe,
        steps,
        ingredients,
      };
    }

    return cocktail;
  },

  // ===== ACTUALIZAR CÓCTEL =====
  update: (id, cocktailData) => {
    const fields = [];
    const params = [];

    // Construir query dinámicamente solo con campos proporcionados
    Object.keys(cocktailData).forEach(key => {
      if (cocktailData[key] !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        params.push(cocktailData[key]);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    // Agregar updated_at
    fields.push("updated_at = datetime('now')");
    params.push(id);

    const stmt = db.prepare(`
      UPDATE cocktails 
      SET ${fields.join(', ')} 
      WHERE id = ?
    `);

    const result = stmt.run(...params);
    return result.changes > 0;
  },

  // ===== ELIMINAR CÓCTEL =====
  delete: id => {
    const stmt = db.prepare('DELETE FROM cocktails WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // ===== CÓCTELES POR CATEGORÍA =====
  getByCategory: categoryId => {
    const stmt = db.prepare(`
      SELECT DISTINCT c.*, cat.name as category_name
      FROM cocktails c
      LEFT JOIN categories cat ON c.id_category = cat.id
      LEFT JOIN cocktail_categories cc ON c.id = cc.id_cocktail
      WHERE c.id_category = ? OR cc.id_category = ?
      ORDER BY c.name
    `);

    return stmt.all(categoryId, categoryId);
  },

  // ===== CÓCTELES FAVORITOS =====
  getFavorites: () => {
    const stmt = db.prepare(`
      SELECT DISTINCT c.*
      FROM cocktails c
      JOIN cocktail_categories cc ON c.id = cc.id_cocktail
      JOIN categories cat ON cc.id_category = cat.id
      WHERE cat.name = 'Favoritos' AND cat.is_system = 1
      ORDER BY cc.added_at DESC
    `);

    return stmt.all();
  },

  // ===== AGREGAR A FAVORITOS =====
  addToFavorites: cocktailId => {
    // Buscar categoría Favoritos
    const favCategory = db
      .prepare('SELECT id FROM categories WHERE name = ? AND is_system = 1')
      .get('Favoritos');
    if (!favCategory) {
      return false;
    }

    const stmt = db.prepare(`
      INSERT OR IGNORE INTO cocktail_categories (id_cocktail, id_category)
      VALUES (?, ?)
    `);

    const result = stmt.run(cocktailId, favCategory.id);
    return result.changes > 0;
  },

  // ===== REMOVER DE FAVORITOS =====
  removeFromFavorites: cocktailId => {
    const favCategory = db
      .prepare('SELECT id FROM categories WHERE name = ? AND is_system = 1')
      .get('Favoritos');
    if (!favCategory) {
      return false;
    }

    const stmt = db.prepare(`
      DELETE FROM cocktail_categories 
      WHERE id_cocktail = ? AND id_category = ?
    `);

    const result = stmt.run(cocktailId, favCategory.id);
    return result.changes > 0;
  },

  // ===== CÓCTELES DESTACADOS =====
  getFeatured: (limit = 10) => {
    const stmt = db.prepare(`
      SELECT c.*, cat.name as category_name
      FROM cocktails c
      LEFT JOIN categories cat ON c.id_category = cat.id
      WHERE c.is_featured = 1
      ORDER BY c.created_at DESC
      LIMIT ?
    `);

    return stmt.all(limit);
  },

  // ===== BUSCAR CÓCTELES =====
  search: (searchTerm, options = {}) => {
    const searchPattern = `%${searchTerm}%`;

    let query = `
      SELECT DISTINCT c.*, cat.name as category_name
      FROM cocktails c
      LEFT JOIN categories cat ON c.id_category = cat.id
      LEFT JOIN recipes r ON c.id = r.id_cocktail
      LEFT JOIN recipe_ingredients ri ON r.id = ri.id_recipe
      LEFT JOIN ingredients i ON ri.id_ingredient = i.id
      WHERE (
        c.name LIKE ? OR 
        c.description LIKE ? OR 
        i.name LIKE ?
      )
    `;

    const params = [searchPattern, searchPattern, searchPattern];

    if (options.difficulty) {
      query += ' AND c.difficulty = ?';
      params.push(options.difficulty);
    }

    query += ' ORDER BY c.name';

    if (options.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
    }

    const stmt = db.prepare(query);
    return stmt.all(...params);
  },

  // ===== ESTADÍSTICAS =====
  getStats: () => {
    const totalStmt = db.prepare('SELECT COUNT(*) as total FROM cocktails');
    const difficultyStmt = db.prepare(`
      SELECT difficulty, COUNT(*) as count 
      FROM cocktails 
      GROUP BY difficulty
    `);
    const categoryStmt = db.prepare(`
      SELECT cat.name, COUNT(c.id) as count
      FROM categories cat
      LEFT JOIN cocktails c ON cat.id = c.id_category
      WHERE cat.is_system = 0
      GROUP BY cat.id, cat.name
    `);

    return {
      total: totalStmt.get().total,
      byDifficulty: difficultyStmt.all(),
      byCategory: categoryStmt.all(),
    };
  },
};

// Mantener compatibilidad con API anterior
export default {
  // API nueva recomendada
  ...CocktailRepository,

  // API anterior para compatibilidad
  guardarCoctel: CocktailRepository.create,
  obtenerTodosCocteles: () => CocktailRepository.getAll(),
  obtenerCoctelPorId: CocktailRepository.getById,
  actualizarCoctel: CocktailRepository.update,
  eliminarCoctel: CocktailRepository.delete,
  buscarCocteles: CocktailRepository.search,
};
