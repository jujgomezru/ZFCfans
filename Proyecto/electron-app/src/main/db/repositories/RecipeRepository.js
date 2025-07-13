import BaseRepository from './BaseRepository.js';

class RecipeRepository extends BaseRepository {
  constructor() {
    super('recipes', 'id');
  }

  /**
   * Obtener receta por ID de cóctel
   */
  findByCocktailId(cocktailId) {
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

    return result.changes > 0;
  }

  /**
   * Agregar paso a receta
   */
  addStep(recipeId, stepData) {
    const stmt = this.db.prepare(`
      INSERT INTO recipe_steps (id_recipe, step_number, instruction, duration, is_critical)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      recipeId,
      stepData.step_number,
      stepData.instruction,
      stepData.duration || null,
      stepData.is_critical || 0,
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
}

export default RecipeRepository;
