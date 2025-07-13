import BaseRepository from './BaseRepository.js';

class CocktailRepository extends BaseRepository {
  constructor() {
    super('cocktails', 'cocktail_id');
  }

  /**
   * Obtener todos los cócteles con información básica
   */
  findAllWithBasicInfo() {
    const query = `
      SELECT
        c.cocktail_id AS id,
        c.name AS nombre,
        COALESCE(cat.name, '') AS categoria,
        img.url AS imagen
      FROM cocktails c
      LEFT JOIN cocktail_categories cc ON cc.cocktail_id = c.cocktail_id
      LEFT JOIN categories cat ON cat.category_id = cc.category_id
      LEFT JOIN (
        SELECT cocktail_id, MIN(image_id) AS min_img_id
        FROM cocktail_images
        GROUP BY cocktail_id
      ) ci ON ci.cocktail_id = c.cocktail_id
      LEFT JOIN cocktail_images img ON img.image_id = ci.min_img_id
      ORDER BY c.created_at DESC
    `;

    return this.db.prepare(query).all();
  }

  /**
   * Obtener cóctel completo por ID
   */
  findCompleteById(id) {
    const cocktailQuery = `
      SELECT
        c.cocktail_id AS id,
        c.name AS nombre,
        c.description,
        c.difficulty,
        c.glass_type,
        c.is_alcoholic,
        c.creator_user_id,
        c.created_at
      FROM cocktails c
      WHERE c.cocktail_id = ?
    `;

    const coctel = this.db.prepare(cocktailQuery).get(id);
    if (!coctel) {
      return null;
    }

    // Obtener ingredientes
    const ingredientesQuery = `
      SELECT i.name, ci.quantity, i.unit_type
      FROM cocktail_ingredients ci
      JOIN ingredients i ON i.ingredient_id = ci.ingredient_id
      WHERE ci.cocktail_id = ?
    `;
    coctel.ingredientes = this.db.prepare(ingredientesQuery).all(id);

    // Obtener pasos
    const pasosQuery = `
      SELECT step_number, instruction
      FROM cocktail_steps
      WHERE cocktail_id = ?
      ORDER BY step_number ASC
    `;
    coctel.pasos = this.db.prepare(pasosQuery).all(id);

    // Obtener imágenes
    const imagenesQuery = `
      SELECT url
      FROM cocktail_images
      WHERE cocktail_id = ?
      ORDER BY uploaded_at ASC
    `;
    coctel.imagenes = this.db.prepare(imagenesQuery).all(id);

    // Obtener categorías
    const categoriasQuery = `
      SELECT cat.name
      FROM cocktail_categories cc
      JOIN categories cat ON cat.category_id = cc.category_id
      WHERE cc.cocktail_id = ?
    `;
    coctel.categorias = this.db
      .prepare(categoriasQuery)
      .all(id)
      .map(row => row.name);

    return coctel;
  }

  /**
   * Buscar cócteles por nombre
   */
  searchByName(nombre) {
    const query = `
      SELECT
        c.cocktail_id AS id,
        c.name AS nombre,
        COALESCE(cat.name, '') AS categoria,
        img.url AS imagen
      FROM cocktails c
      LEFT JOIN cocktail_categories cc ON cc.cocktail_id = c.cocktail_id
      LEFT JOIN categories cat ON cat.category_id = cc.category_id
      LEFT JOIN (
        SELECT cocktail_id, MIN(image_id) AS min_img_id
        FROM cocktail_images
        GROUP BY cocktail_id
      ) ci ON ci.cocktail_id = c.cocktail_id
      LEFT JOIN cocktail_images img ON img.image_id = ci.min_img_id
      WHERE c.name LIKE ?
      ORDER BY c.name ASC
    `;

    return this.db.prepare(query).all(`%${nombre}%`);
  }

  /**
   * Obtener cócteles por categoría
   */
  findByCategory(categoria) {
    const query = `
      SELECT
        c.cocktail_id AS id,
        c.name AS nombre,
        COALESCE(cat.name, '') AS categoria,
        img.url AS imagen
      FROM cocktails c
      JOIN cocktail_categories cc ON cc.cocktail_id = c.cocktail_id
      JOIN categories cat ON cat.category_id = cc.category_id
      LEFT JOIN (
        SELECT cocktail_id, MIN(image_id) AS min_img_id
        FROM cocktail_images
        GROUP BY cocktail_id
      ) ci ON ci.cocktail_id = c.cocktail_id
      LEFT JOIN cocktail_images img ON img.image_id = ci.min_img_id
      WHERE cat.name = ?
      ORDER BY c.name ASC
    `;

    return this.db.prepare(query).all(categoria);
  }

  /**
   * Crear nuevo cóctel
   */
  createCocktail(coctel) {
    const stmt = this.db.prepare(`
      INSERT INTO cocktails (
        name, description, difficulty, glass_type, is_alcoholic, creator_user_id
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      coctel.nombre,
      coctel.descripcion || null,
      coctel.dificultad || 1,
      coctel.vaso || null,
      coctel.is_alcoholic ? 1 : 0,
      coctel.user_id,
    );

    return result.lastInsertRowid;
  }

  /**
   * Actualizar cóctel
   */
  updateCocktail(id, coctel) {
    const stmt = this.db.prepare(`
      UPDATE cocktails SET
        name = ?, description = ?, difficulty = ?, glass_type = ?,
        is_alcoholic = ?, creator_user_id = ?
      WHERE cocktail_id = ?
    `);

    const result = stmt.run(
      coctel.nombre,
      coctel.descripcion || null,
      coctel.dificultad || 1,
      coctel.vaso || null,
      coctel.is_alcoholic ? 1 : 0,
      coctel.user_id,
      id,
    );

    return result.changes > 0;
  }

  /**
   * Obtener estadísticas
   */
  getStatistics() {
    const totalStmt = this.db.prepare('SELECT COUNT(*) as total FROM cocktails');

    const categoriaStmt = this.db.prepare(`
      SELECT cat.name AS categoria, COUNT(*) as count
      FROM cocktail_categories cc
      JOIN categories cat ON cat.category_id = cc.category_id
      GROUP BY cat.name
    `);

    return {
      total: totalStmt.get().total,
      por_categoria: categoriaStmt.all(),
    };
  }
}

export default CocktailRepository;
