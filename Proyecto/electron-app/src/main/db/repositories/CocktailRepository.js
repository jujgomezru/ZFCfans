import BaseRepository from './BaseRepository.js';

class CocktailRepository extends BaseRepository {
  constructor() {
    super('cocktails', 'id');
  }

  /**
   * Obtener todos los cócteles con información básica
   */
  findAllWithBasicInfo() {
    const query = `
      SELECT
        c.id,
        c.name AS nombre,
        c.img_url AS imagen,
        c.difficulty AS dificultad,
        c.description AS descripcion,
        c.preparation_time AS tiempo_preparacion,
        c.alcohol_content AS contenido_alcohol,
        COALESCE(cat.name, '') AS categoria,
        cat.color AS categoria_color,
        p.name AS maridaje
      FROM cocktails c
      LEFT JOIN categories cat ON c.id_category = cat.id
      LEFT JOIN pairings p ON c.id_pairing = p.id
      ORDER BY c.name ASC
    `;

    return this.db.prepare(query).all();
  }

  /**
   * Obtener cóctel completo por ID con ingredientes y pasos
   */
  findCompleteById(id) {
    // Información básica del cóctel
    const cocktailQuery = `
      SELECT
        c.*,
        cat.name AS categoria_nombre,
        cat.color AS categoria_color,
        p.name AS maridaje_nombre,
        p.description AS maridaje_descripcion,
        u.username AS creador,
        r.glass_type,
        r.garnish,
        r.serving_suggestion
      FROM cocktails c
      LEFT JOIN categories cat ON c.id_category = cat.id
      LEFT JOIN pairings p ON c.id_pairing = p.id
      LEFT JOIN users u ON c.id_owner = u.id
      LEFT JOIN recipes r ON c.id = r.id_cocktail
      WHERE c.id = ?
    `;

    const cocktail = this.db.prepare(cocktailQuery).get(id);
    if (!cocktail) {
      return null;
    }

    // Obtener ingredientes
    const ingredientsQuery = `
      SELECT
        i.name AS nombre,
        ri.quantity AS cantidad,
        ri.unit AS unidad,
        ri.preparation_note AS nota_preparacion,
        ri.is_optional AS es_opcional,
        ri.order_index,
        i.type AS tipo,
        i.category AS categoria_ingrediente,
        i.alcohol_content AS contenido_alcohol
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.id_ingredient = i.id
      JOIN recipes r ON ri.id_recipe = r.id
      WHERE r.id_cocktail = ?
      ORDER BY ri.order_index ASC, ri.is_optional ASC
    `;

    cocktail.ingredientes = this.db.prepare(ingredientsQuery).all(id);

    // Obtener pasos de preparación
    const stepsQuery = `
      SELECT
        rs.step_number AS numero,
        rs.instruction AS instruccion,
        rs.duration AS duracion,
        rs.is_critical AS es_critico
      FROM recipe_steps rs
      JOIN recipes r ON rs.id_recipe = r.id
      WHERE r.id_cocktail = ?
      ORDER BY rs.step_number ASC
    `;

    cocktail.pasos = this.db.prepare(stepsQuery).all(id);

    // Obtener categorías adicionales
    const categoriesQuery = `
      SELECT
        cat.id,
        cat.name AS nombre,
        cat.color,
        cat.description AS descripcion
      FROM cocktail_categories cc
      JOIN categories cat ON cc.id_category = cat.id
      WHERE cc.id_cocktail = ?
    `;

    cocktail.categorias = this.db.prepare(categoriesQuery).all(id);

    return cocktail;
  }

  /**
   * Buscar cócteles por nombre
   */
  searchByName(searchTerm) {
    const query = `
      SELECT
        c.id,
        c.name AS nombre,
        c.img_url AS imagen,
        c.difficulty AS dificultad,
        c.description AS descripcion,
        COALESCE(cat.name, '') AS categoria
      FROM cocktails c
      LEFT JOIN categories cat ON c.id_category = cat.id
      WHERE c.name LIKE ? OR c.description LIKE ?
      ORDER BY 
        CASE WHEN c.name LIKE ? THEN 1 ELSE 2 END,
        c.name ASC
    `;

    const searchPattern = `%${searchTerm}%`;
    const exactPattern = `${searchTerm}%`;

    return this.db.prepare(query).all(searchPattern, searchPattern, exactPattern);
  }

  /**
   * Filtrar cócteles por dificultad
   */
  findByDifficulty(difficulty) {
    const query = `
      SELECT
        c.id,
        c.name AS nombre,
        c.img_url AS imagen,
        c.difficulty AS dificultad,
        c.description AS descripcion,
        c.preparation_time AS tiempo_preparacion,
        COALESCE(cat.name, '') AS categoria
      FROM cocktails c
      LEFT JOIN categories cat ON c.id_category = cat.id
      WHERE c.difficulty = ?
      ORDER BY c.name ASC
    `;

    return this.db.prepare(query).all(difficulty);
  }

  /**
   * Obtener cócteles por categoría
   */
  findByCategory(categoryId) {
    const query = `
      SELECT
        c.id,
        c.name AS nombre,
        c.img_url AS imagen,
        c.difficulty AS dificultad,
        c.description AS descripcion,
        c.preparation_time AS tiempo_preparacion
      FROM cocktails c
      JOIN cocktail_categories cc ON c.id = cc.id_cocktail
      WHERE cc.id_category = ?
      ORDER BY c.name ASC
    `;

    return this.db.prepare(query).all(categoryId);
  }

  /**
   * Crear cóctel completo con ingredientes y pasos
   */
  createComplete(cocktailData) {
    const transaction = this.db.transaction(() => {
      // 1. Crear el cóctel
      const cocktailId = this.create({
        name: cocktailData.name,
        img_url: cocktailData.img_url || null,
        difficulty: cocktailData.difficulty,
        description: cocktailData.description || null,
        additional_notes: cocktailData.additional_notes || null,
        preparation_time: cocktailData.preparation_time || null,
        servings: cocktailData.servings || 1,
        alcohol_content: cocktailData.alcohol_content || null,
        is_featured: cocktailData.is_featured || 0,
        id_owner: cocktailData.id_owner || null,
        id_pairing: cocktailData.id_pairing || null,
        id_category: cocktailData.id_category || null,
      });

      // 2. Crear la receta
      const recipeStmt = this.db.prepare(`
        INSERT INTO recipes (id_cocktail, glass_type, garnish, serving_suggestion)
        VALUES (?, ?, ?, ?)
      `);

      const recipeResult = recipeStmt.run(
        cocktailId,
        cocktailData.glass_type || null,
        cocktailData.garnish || null,
        cocktailData.serving_suggestion || null,
      );

      const recipeId = recipeResult.lastInsertRowid;

      // 3. Agregar ingredientes si existen
      if (cocktailData.ingredientes && cocktailData.ingredientes.length > 0) {
        const ingredientStmt = this.db.prepare(`
          INSERT INTO recipe_ingredients 
          (id_recipe, id_ingredient, quantity, unit, preparation_note, is_optional, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        cocktailData.ingredientes.forEach((ingrediente, index) => {
          ingredientStmt.run(
            recipeId,
            ingrediente.id_ingredient,
            ingrediente.quantity,
            ingrediente.unit,
            ingrediente.preparation_note || null,
            ingrediente.is_optional || 0,
            ingrediente.order_index || index,
          );
        });
      }

      // 4. Agregar pasos si existen
      if (cocktailData.pasos && cocktailData.pasos.length > 0) {
        const stepStmt = this.db.prepare(`
          INSERT INTO recipe_steps (id_recipe, step_number, instruction, duration, is_critical)
          VALUES (?, ?, ?, ?, ?)
        `);

        cocktailData.pasos.forEach((paso, index) => {
          stepStmt.run(
            recipeId,
            paso.step_number || index + 1,
            paso.instruction,
            paso.duration || null,
            paso.is_critical || 0,
          );
        });
      }

      // 5. Agregar categorías adicionales si existen
      if (cocktailData.categorias_adicionales && cocktailData.categorias_adicionales.length > 0) {
        const categoryStmt = this.db.prepare(`
          INSERT INTO cocktail_categories (id_cocktail, id_category)
          VALUES (?, ?)
        `);

        cocktailData.categorias_adicionales.forEach(categoryId => {
          categoryStmt.run(cocktailId, categoryId);
        });
      }

      return cocktailId;
    });

    return transaction();
  }

  /**
   * Obtener cócteles destacados
   */
  findFeatured() {
    const query = `
      SELECT
        c.id,
        c.name AS nombre,
        c.img_url AS imagen,
        c.difficulty AS dificultad,
        c.description AS descripcion,
        c.preparation_time AS tiempo_preparacion,
        COALESCE(cat.name, '') AS categoria
      FROM cocktails c
      LEFT JOIN categories cat ON c.id_category = cat.id
      WHERE c.is_featured = 1
      ORDER BY c.created_at DESC
    `;

    return this.db.prepare(query).all();
  }

  /**
   * Obtener estadísticas de cócteles
   */
  getStatistics() {
    const stats = {
      total: this.db.prepare('SELECT COUNT(*) as count FROM cocktails').get().count,
      por_dificultad: this.db
        .prepare(
          `
        SELECT difficulty, COUNT(*) as count 
        FROM cocktails 
        GROUP BY difficulty
      `,
        )
        .all(),
      con_alcohol: this.db
        .prepare(
          `
        SELECT COUNT(*) as count 
        FROM cocktails 
        WHERE alcohol_content > 0
      `,
        )
        .get().count,
      destacados: this.db
        .prepare(
          `
        SELECT COUNT(*) as count 
        FROM cocktails 
        WHERE is_featured = 1
      `,
        )
        .get().count,
    };

    return stats;
  }

  /**
   * Métodos de compatibilidad con el sistema anterior
   */
  obtenerTodosCocteles() {
    return this.findAllWithBasicInfo();
  }

  obtenerCoctelPorId(id) {
    return this.findCompleteById(id);
  }

  buscarCoctelesPorNombre(nombre) {
    return this.searchByName(nombre);
  }
}

export default CocktailRepository;
