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
        p.name AS maridaje,
        GROUP_CONCAT(cat.name, ', ') AS categorias,
        GROUP_CONCAT(cat.color, ', ') AS categorias_colores
      FROM cocktails c
      LEFT JOIN pairings p ON c.id_pairing = p.id
      LEFT JOIN cocktail_categories cc ON c.id = cc.id_cocktail
      LEFT JOIN categories cat ON cc.id_category = cat.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `;

    return this.db.prepare(query).all();
  }

  /**
   * Obtener cóctel completo por ID con ingredientes y pasos
   */
  findCompleteById(id) {
    // Información básica del cóctel con categorías incluidas
    const cocktailQuery = `
      SELECT
        c.*,
        p.name AS maridaje_nombre,
        p.description AS maridaje_descripcion,
        u.username AS creador,
        r.glass_type,
        r.garnish,
        r.serving_suggestion,
        GROUP_CONCAT(DISTINCT cat.name, ', ') AS categorias_nombres,
        GROUP_CONCAT(DISTINCT cat.color, ', ') AS categorias_colores
      FROM cocktails c
      LEFT JOIN pairings p ON c.id_pairing = p.id
      LEFT JOIN users u ON c.id_owner = u.id
      LEFT JOIN recipes r ON c.id = r.id_cocktail
      LEFT JOIN cocktail_categories cc ON c.id = cc.id_cocktail
      LEFT JOIN categories cat ON cc.id_category = cat.id
      WHERE c.id = ?
      GROUP BY c.id
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

    return cocktail;
  }

  /**
   * Buscar cócteles por nombre
   */
  searchByName(searchTerm) {
    const query = `
      SELECT DISTINCT
        c.id,
        c.name AS nombre,
        c.img_url AS imagen,
        c.difficulty AS dificultad,
        c.description AS descripcion,
        GROUP_CONCAT(cat.name, ', ') AS categorias
      FROM cocktails c
      LEFT JOIN cocktail_categories cc ON c.id = cc.id_cocktail
      LEFT JOIN categories cat ON cc.id_category = cat.id
      WHERE c.name LIKE ? OR c.description LIKE ?
      GROUP BY c.id
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
      SELECT DISTINCT
        c.id,
        c.name AS nombre,
        c.img_url AS imagen,
        c.difficulty AS dificultad,
        c.description AS descripcion,
        c.preparation_time AS tiempo_preparacion,
        GROUP_CONCAT(cat.name, ', ') AS categorias
      FROM cocktails c
      LEFT JOIN cocktail_categories cc ON c.id = cc.id_cocktail
      LEFT JOIN categories cat ON cc.id_category = cat.id
      WHERE c.difficulty = ?
      GROUP BY c.id
      ORDER BY c.name ASC
    `;

    return this.db.prepare(query).all(difficulty);
  }

  /**
   * Obtener cócteles por categoría
   */
  findByCategory(categoryId) {
    if (categoryId === undefined || categoryId === null) {
      throw new Error('Category ID is required');
    }
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
  // Activar claves foráneas (muy importante en SQLite)
  this.db.pragma('foreign_keys = ON');

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
    });

    // 2. Crear receta
    const recipeStmt = this.db.prepare(`
      INSERT INTO recipes (id_cocktail, glass_type, garnish, serving_suggestion)
      VALUES (?, ?, ?, ?)
    `);

    recipeStmt.run(
      cocktailId,
      cocktailData.glass_type || null,
      cocktailData.garnish || null,
      cocktailData.serving_suggestion || null,
    );

    // ✅ Asegurar el ID correcto de la receta
    const recipeId = this.db.prepare(`SELECT last_insert_rowid() as id`).get().id;

    // 3. Insertar ingredientes
    if (cocktailData.ingredientes && cocktailData.ingredientes.length > 0) {
      const ingredientStmt = this.db.prepare(`
        INSERT INTO recipe_ingredients 
        (id_recipe, id_ingredient, quantity, unit, preparation_note, is_optional, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      cocktailData.ingredientes.forEach((ingrediente, index) => {
        const ingredientId = this.getOrCreateIngredientId(ingrediente.name);

        // Validación defensiva
        if (!ingredientId || !recipeId) {
          throw new Error(`Error: id_ingredient o id_recipe inválido`);
        }

         // 🧪 Agrega este bloque justo antes de insertar
        console.log("DEBUG: Validando claves foráneas");
        console.log("ID de receta:", recipeId);
        console.log("ID de ingrediente:", ingredientId);
        console.log("¿Existe la receta?",
          this.db.prepare("SELECT id FROM recipes WHERE id = ?").get(recipeId));
        console.log("¿Existe el ingrediente?",
          this.db.prepare("SELECT id FROM ingredients WHERE id = ?").get(ingredientId));

        ingredientStmt.run(
          recipeId,
          ingredientId,
          ingrediente.quantity,
          ingrediente.unit,
          ingrediente.preparation_note || null,
          ingrediente.is_optional || 0,
          ingrediente.order_index || index,
        );
      });
    }

    // 4. Insertar pasos
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

    // 5. Insertar categorías
    const categoryStmt = this.db.prepare(`
      INSERT INTO cocktail_categories (id_cocktail, id_category)
      VALUES (?, ?)
    `);

    if (cocktailData.id_category) {
      categoryStmt.run(cocktailId, cocktailData.id_category);
    }

    if (cocktailData.categorias_adicionales && cocktailData.categorias_adicionales.length > 0) {
      cocktailData.categorias_adicionales.forEach(categoryId => {
        if (categoryId !== cocktailData.id_category) {
          categoryStmt.run(cocktailId, categoryId);
        }
      });
    }

    if (cocktailData.categorias && cocktailData.categorias.length > 0) {
      cocktailData.categorias.forEach(categoryId => {
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
      SELECT DISTINCT
        c.id,
        c.name AS nombre,
        c.img_url AS imagen,
        c.difficulty AS dificultad,
        c.description AS descripcion,
        c.preparation_time AS tiempo_preparacion,
        GROUP_CONCAT(cat.name, ', ') AS categorias
      FROM cocktails c
      LEFT JOIN cocktail_categories cc ON c.id = cc.id_cocktail
      LEFT JOIN categories cat ON cc.id_category = cat.id
      WHERE c.is_featured = 1
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;

    return this.db.prepare(query).all();
  }

  /**
   * Obtener estadísticas de cócteles
   */
  getStatistics() {
    // Para compatibilidad con tests que mockean prepare().get()
    const query = `
      SELECT 
        COUNT(*) as total_cocktails,
        SUM(CASE WHEN is_alcoholic = 1 THEN 1 ELSE 0 END) as alcoholic_cocktails,
        SUM(CASE WHEN is_alcoholic = 0 THEN 1 ELSE 0 END) as non_alcoholic_cocktails,
        AVG(alcohol_content) as avg_alcohol_content,
        AVG(preparation_time) as avg_preparation_time
      FROM cocktails
    `;
    const stmt = this.db.prepare(query);
    return stmt.get();
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

  /**
   * Buscar cócteles por contenido de alcohol
   */
  findByAlcoholContent(isAlcoholic) {
    const query = `
      SELECT
        c.id,
        c.name,
        c.description,
        c.difficulty,
        c.preparation_time,
        c.alcohol_content,
        c.is_alcoholic,
        c.img_url,
        GROUP_CONCAT(cat.name, ', ') AS categorias
      FROM cocktails c
      LEFT JOIN cocktail_categories cc ON c.id = cc.id_cocktail
      LEFT JOIN categories cat ON cc.id_category = cat.id
      WHERE c.is_alcoholic = ?
      GROUP BY c.id
      ORDER BY c.name
    `;
    const stmt = this.db.prepare(query);
    return stmt.all(isAlcoholic ? 1 : 0);
  }

  /**
   * Buscar cócteles por creador
   */
  findByCreator(creatorId) {
    const query = `
      SELECT
        c.id,
        c.name,
        c.description,
        c.difficulty,
        c.preparation_time,
        c.alcohol_content,
        c.is_alcoholic,
        c.img_url,
        c.id_creator,
        GROUP_CONCAT(cat.name, ', ') AS categorias
      FROM cocktails c
      LEFT JOIN cocktail_categories cc ON c.id = cc.id_cocktail
      LEFT JOIN categories cat ON cc.id_category = cat.id
      WHERE c.id_creator = ?
      GROUP BY c.id
      ORDER BY c.name
    `;
    const stmt = this.db.prepare(query);
    return stmt.all(creatorId);
  }

  /**
   * Obtener categorías de un cóctel
   */
  getCategoriesForCocktail(cocktailId) {
    const query = `
      SELECT cat.id, cat.name, cat.color
      FROM categories cat
      INNER JOIN cocktail_categories cc ON cat.id = cc.id_category
      WHERE cc.id_cocktail = ?
      ORDER BY cat.name
    `;
    const stmt = this.db.prepare(query);
    return stmt.all(cocktailId);
  }

  /**
   * Agregar cóctel a una categoría
   */
  addToCategory(cocktailId, categoryId) {
    const query = `
      INSERT OR IGNORE INTO cocktail_categories (id_cocktail, id_category)
      VALUES (?, ?)
    `;
    const stmt = this.db.prepare(query);
    const result = stmt.run(cocktailId, categoryId);
    return result.lastInsertRowid;
  }

  /**
   * Remover cóctel de una categoría
   */
  removeFromCategory(cocktailId, categoryId) {
    const query = `
      DELETE FROM cocktail_categories
      WHERE id_cocktail = ? AND id_category = ?
    `;
    const stmt = this.db.prepare(query);
    const result = stmt.run(cocktailId, categoryId);
    return result.changes;
  }

  getDifficulty(cocktailId) {
    const row = this.db.prepare(`SELECT difficulty FROM cocktails WHERE id = ?`).get(cocktailId);
    return row?.difficulty ?? null;
  }

  getTotalDuration(cocktailId) {
    const row = this.db
      .prepare(
        `
        SELECT SUM(rs.duration) AS total_duration
        FROM recipe_steps rs
        JOIN recipes r ON rs.id_recipe = r.id
        WHERE r.id_cocktail = ?
      `,
      )
      .get(cocktailId);
    return row?.total_duration ?? 0;
  }
}

export default CocktailRepository;
