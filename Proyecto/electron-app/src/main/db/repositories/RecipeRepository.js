import BaseRepository from './BaseRepository.js';

class RecipeRepository extends BaseRepository {
  constructor() {
    super('recipes', 'id');
  }

  /**
   * Obtener receta por ID de cóctel
   */
  findByCocktailId(cocktailId) {
    if (!cocktailId) {
      throw new Error('Cocktail ID is required');
    }

    const query = `
      SELECT
        r.*,
        c.name AS cocktail_name
      FROM recipes r
      JOIN cocktails c ON r.id_cocktail = c.id
      WHERE r.id_cocktail = ?
    `;

    return this.db.prepare(query).get(cocktailId);
  }

  /**
   * Crear receta para un cóctel
   */
  createForCocktail(cocktailId, recipeData) {
    if (!cocktailId) {
      throw new Error('Cocktail ID is required');
    }

    const stmt = this.db.prepare(`
      INSERT INTO recipes (id_cocktail, glass_type, garnish, serving_suggestion)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      cocktailId,
      recipeData.glass_type || null,
      recipeData.garnish || null,
      recipeData.serving_suggestion || null,
    );

    return result.lastInsertRowid;
  }

  /**
   * Obtener ingredientes de una receta
   */
  getIngredients(recipeId) {
    if (!recipeId) {
      throw new Error('Recipe ID is required');
    }

    const query = `
      SELECT
        ri.*,
        i.name AS ingredient_name,
        i.type AS ingredient_type,
        i.category AS ingredient_category,
        i.alcohol_content
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.id_ingredient = i.id
      WHERE ri.id_recipe = ?
      ORDER BY ri.order_index ASC, ri.is_optional ASC
    `;

    return this.db.prepare(query).all(recipeId);
  }

  /**
   * Obtener pasos de una receta
   */
  getSteps(recipeId) {
    const query = `
      SELECT *
      FROM recipe_steps
      WHERE id_recipe = ?
      ORDER BY step_number ASC
    `;

    return this.db.prepare(query).all(recipeId);
  }

  /**
   * Agregar ingrediente a receta
   */
  addIngredient(recipeId, ingredientData) {
    const stmt = this.db.prepare(`
      INSERT INTO recipe_ingredients 
      (id_recipe, id_ingredient, quantity, unit, preparation_note, is_optional, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      recipeId,
      ingredientData.id_ingredient,
      ingredientData.quantity,
      ingredientData.unit,
      ingredientData.preparation_note || null,
      ingredientData.is_optional || 0,
      ingredientData.order_index || 0,
    );

    return result.lastInsertRowid;
  }

  /**
   * Agregar paso a receta
   */
  addStep(recipeId, stepData) {
    const stmt = this.db.prepare(`
      INSERT INTO recipe_steps (id_recipe, step_number, instruction, duration_seconds, technique, tips)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      recipeId,
      stepData.step_number,
      stepData.instruction,
      stepData.duration_seconds || null,
      stepData.technique || null,
      stepData.tips || null,
    );

    return result.lastInsertRowid;
  }

  /**
   * Obtener receta completa con ingredientes y pasos
   */
  getComplete(recipeId) {
    const recipe = this.findById(recipeId);
    if (!recipe) {
      return null;
    }

    recipe.ingredients = this.getIngredients(recipeId);
    recipe.steps = this.getSteps(recipeId);

    return recipe;
  }

  /**
   * Calcular tiempo total de preparación
   */
  calculateTotalTime(recipeId) {
    const stmt = this.db.prepare(`
      SELECT SUM(duration) as total_seconds
      FROM recipe_steps
      WHERE id_recipe = ? AND duration IS NOT NULL
    `);

    const result = stmt.get(recipeId);
    return result.total_seconds || 0;
  }

  /**
   * Obtener pasos críticos
   */
  getCriticalSteps(recipeId) {
    const query = `
      SELECT *
      FROM recipe_steps
      WHERE id_recipe = ? AND is_critical = 1
      ORDER BY step_number ASC
    `;

    return this.db.prepare(query).all(recipeId);
  }

  /**
   * Actualizar ingrediente en receta
   */
  updateIngredient(ingredientId, updates) {
    if (!ingredientId) {
      throw new Error('Ingredient ID is required');
    }

    const fields = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = Object.values(updates);

    const stmt = this.db.prepare(`
      UPDATE recipe_ingredients 
      SET ${fields}
      WHERE id = ?
    `);

    const result = stmt.run(...values, ingredientId);
    return result.changes;
  }

  /**
   * Remover ingrediente de receta
   */
  removeIngredient(ingredientId) {
    if (!ingredientId) {
      throw new Error('Ingredient ID is required');
    }

    const stmt = this.db.prepare('DELETE FROM recipe_ingredients WHERE id = ?');
    const result = stmt.run(ingredientId);
    return result.changes;
  }

  /**
   * Actualizar paso de receta
   */
  updateStep(stepId, updates) {
    if (!stepId) {
      throw new Error('Step ID is required');
    }

    const fields = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = Object.values(updates);

    const stmt = this.db.prepare(`
      UPDATE recipe_steps 
      SET ${fields}
      WHERE id = ?
    `);

    const result = stmt.run(...values, stepId);
    return result.changes;
  }

  /**
   * Remover paso de receta
   */
  removeStep(stepId) {
    if (!stepId) {
      throw new Error('Step ID is required');
    }

    const stmt = this.db.prepare('DELETE FROM recipe_steps WHERE id = ?');
    const result = stmt.run(stepId);
    return result.changes;
  }

  /**
   * Obtener complejidad de una receta
   */
  getRecipeComplexity(recipeId) {
    if (!recipeId) {
      throw new Error('Recipe ID is required');
    }

    const stmt = this.db.prepare(`
      SELECT 
        COUNT(ri.id) as total_ingredients,
        COUNT(rs.id) as total_steps,
        COALESCE(SUM(rs.duration_seconds), 0) as total_time,
        COUNT(CASE WHEN ri.is_optional = 1 THEN 1 END) as optional_ingredients,
        (COUNT(ri.id) * 1.5 + COUNT(rs.id) * 2.0 + COALESCE(SUM(rs.duration_seconds), 0) / 60.0) as complexity_score
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON r.id = ri.id_recipe
      LEFT JOIN recipe_steps rs ON r.id = rs.id_recipe
      WHERE r.id = ?
      GROUP BY r.id
    `);

    return stmt.get(recipeId);
  }

  /**
   * Encontrar recetas por tipo de vaso
   */
  findByGlassType(glassType) {
    if (!glassType) {
      throw new Error('Glass type is required');
    }

    const stmt = this.db.prepare(`
      SELECT r.*, c.name as cocktail_name
      FROM recipes r
      JOIN cocktails c ON r.id_cocktail = c.id
      WHERE r.glass_type = ?
    `);

    return stmt.all(glassType);
  }

  /**
   * Duplicar una receta completa
   */
  duplicateRecipe(originalRecipeId, newCocktailId) {
    if (!originalRecipeId || !newCocktailId) {
      throw new Error('Original recipe ID and new cocktail ID are required');
    }

    // Obtener receta original
    const originalRecipe = this.findById(originalRecipeId);
    if (!originalRecipe) {
      throw new Error('Original recipe not found');
    }

    // Crear nueva receta
    const newRecipeId = this.createForCocktail(newCocktailId, {
      glass_type: originalRecipe.glass_type,
      garnish: originalRecipe.garnish,
      serving_suggestion: originalRecipe.serving_suggestion,
    });

    // Copiar ingredientes
    const ingredientsStmt = this.db.prepare(`
      SELECT * FROM recipe_ingredients WHERE id_recipe = ?
    `);
    const ingredients = ingredientsStmt.all(originalRecipeId);

    // Usar el mismo statement para insertar todo
    ingredients.forEach(ingredient => {
      const insertStmt = this.db.prepare(`
        INSERT INTO recipe_ingredients 
        (id_recipe, id_ingredient, quantity, unit, preparation_note, is_optional, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      insertStmt.run(
        newRecipeId,
        ingredient.id_ingredient,
        ingredient.quantity,
        ingredient.unit,
        ingredient.preparation_note,
        ingredient.is_optional,
        ingredient.order_index,
      );
    });

    return newRecipeId;
  }
}

export default RecipeRepository;
