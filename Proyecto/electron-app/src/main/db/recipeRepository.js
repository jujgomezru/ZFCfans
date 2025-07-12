import db from './database.js';

// ================================
// REPOSITORIO DE RECETAS
// ================================

const RecipeRepository = {
  // ===== CREAR RECETA COMPLETA =====
  create: recipeData => {
    const transaction = db.transaction(() => {
      // 1. Crear la receta base
      const recipeStmt = db.prepare(`
        INSERT INTO recipes (id_cocktail, glass_type, garnish, serving_suggestion)
        VALUES (?, ?, ?, ?)
      `);

      const recipeResult = recipeStmt.run(
        recipeData.id_cocktail,
        recipeData.glass_type || null,
        recipeData.garnish || null,
        recipeData.serving_suggestion || null,
      );

      const recipeId = recipeResult.lastInsertRowid;

      // 2. Agregar pasos de la receta
      if (recipeData.steps && recipeData.steps.length > 0) {
        const stepStmt = db.prepare(`
          INSERT INTO recipe_steps (id_recipe, step_number, instruction, duration, is_critical)
          VALUES (?, ?, ?, ?, ?)
        `);

        recipeData.steps.forEach((step, index) => {
          stepStmt.run(
            recipeId,
            step.step_number || index + 1,
            step.instruction,
            step.duration || null,
            step.is_critical || 0,
          );
        });
      }

      // 3. Agregar ingredientes
      if (recipeData.ingredients && recipeData.ingredients.length > 0) {
        const ingredientStmt = db.prepare(`
          INSERT INTO recipe_ingredients 
          (id_recipe, id_ingredient, quantity, unit, preparation_note, is_optional, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        recipeData.ingredients.forEach((ingredient, index) => {
          ingredientStmt.run(
            recipeId,
            ingredient.id_ingredient,
            ingredient.quantity,
            ingredient.unit,
            ingredient.preparation_note || null,
            ingredient.is_optional || 0,
            ingredient.order_index || index,
          );
        });
      }

      return recipeId;
    });

    return transaction();
  },

  // ===== OBTENER RECETA COMPLETA =====
  getById: id => {
    // Obtener datos básicos de la receta
    const recipeStmt = db.prepare(`
      SELECT 
        r.*,
        c.name as cocktail_name,
        c.difficulty as cocktail_difficulty
      FROM recipes r
      JOIN cocktails c ON r.id_cocktail = c.id
      WHERE r.id = ?
    `);

    const recipe = recipeStmt.get(id);
    if (!recipe) {
      return null;
    }

    // Obtener pasos
    const stepsStmt = db.prepare(`
      SELECT * FROM recipe_steps 
      WHERE id_recipe = ? 
      ORDER BY step_number
    `);
    recipe.steps = stepsStmt.all(id);

    // Obtener ingredientes
    const ingredientsStmt = db.prepare(`
      SELECT 
        ri.*,
        i.name as ingredient_name,
        i.type as ingredient_type,
        i.category as ingredient_category,
        i.alcohol_content as ingredient_alcohol,
        i.description as ingredient_description
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.id_ingredient = i.id
      WHERE ri.id_recipe = ?
      ORDER BY ri.order_index, i.name
    `);
    recipe.ingredients = ingredientsStmt.all(id);

    return recipe;
  },

  // ===== OBTENER RECETA POR CÓCTEL =====
  getByCocktailId: cocktailId => {
    const stmt = db.prepare('SELECT * FROM recipes WHERE id_cocktail = ?');
    const recipe = stmt.get(cocktailId);

    if (!recipe) {
      return null;
    }

    return RecipeRepository.getById(recipe.id);
  },

  // ===== ACTUALIZAR RECETA BASE =====
  update: (id, recipeData) => {
    const fields = [];
    const params = [];

    Object.keys(recipeData).forEach(key => {
      if (
        recipeData[key] !== undefined &&
        key !== 'id' &&
        key !== 'steps' &&
        key !== 'ingredients'
      ) {
        fields.push(`${key} = ?`);
        params.push(recipeData[key]);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    fields.push("updated_at = datetime('now')");
    params.push(id);

    const stmt = db.prepare(`
      UPDATE recipes 
      SET ${fields.join(', ')} 
      WHERE id = ?
    `);

    const result = stmt.run(...params);
    return result.changes > 0;
  },

  // ===== ACTUALIZAR RECETA COMPLETA =====
  updateComplete: (id, recipeData) => {
    const transaction = db.transaction(() => {
      // 1. Actualizar datos básicos
      RecipeRepository.update(id, recipeData);

      // 2. Actualizar pasos si se proporcionan
      if (recipeData.steps) {
        // Eliminar pasos existentes
        db.prepare('DELETE FROM recipe_steps WHERE id_recipe = ?').run(id);

        // Agregar nuevos pasos
        if (recipeData.steps.length > 0) {
          const stepStmt = db.prepare(`
            INSERT INTO recipe_steps (id_recipe, step_number, instruction, duration, is_critical)
            VALUES (?, ?, ?, ?, ?)
          `);

          recipeData.steps.forEach((step, index) => {
            stepStmt.run(
              id,
              step.step_number || index + 1,
              step.instruction,
              step.duration || null,
              step.is_critical || 0,
            );
          });
        }
      }

      // 3. Actualizar ingredientes si se proporcionan
      if (recipeData.ingredients) {
        // Eliminar ingredientes existentes
        db.prepare('DELETE FROM recipe_ingredients WHERE id_recipe = ?').run(id);

        // Agregar nuevos ingredientes
        if (recipeData.ingredients.length > 0) {
          const ingredientStmt = db.prepare(`
            INSERT INTO recipe_ingredients 
            (id_recipe, id_ingredient, quantity, unit, preparation_note, is_optional, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `);

          recipeData.ingredients.forEach((ingredient, index) => {
            ingredientStmt.run(
              id,
              ingredient.id_ingredient,
              ingredient.quantity,
              ingredient.unit,
              ingredient.preparation_note || null,
              ingredient.is_optional || 0,
              ingredient.order_index || index,
            );
          });
        }
      }

      return true;
    });

    return transaction();
  },

  // ===== ELIMINAR RECETA =====
  delete: id => {
    const stmt = db.prepare('DELETE FROM recipes WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // ===== AGREGAR PASO A RECETA =====
  addStep: (recipeId, stepData) => {
    const stmt = db.prepare(`
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
  },

  // ===== ACTUALIZAR PASO =====
  updateStep: (stepId, stepData) => {
    const fields = [];
    const params = [];

    Object.keys(stepData).forEach(key => {
      if (stepData[key] !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        params.push(stepData[key]);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    params.push(stepId);

    const stmt = db.prepare(`
      UPDATE recipe_steps 
      SET ${fields.join(', ')} 
      WHERE id = ?
    `);

    const result = stmt.run(...params);
    return result.changes > 0;
  },

  // ===== ELIMINAR PASO =====
  deleteStep: stepId => {
    const stmt = db.prepare('DELETE FROM recipe_steps WHERE id = ?');
    const result = stmt.run(stepId);
    return result.changes > 0;
  },

  // ===== AGREGAR INGREDIENTE A RECETA =====
  addIngredient: (recipeId, ingredientData) => {
    const stmt = db.prepare(`
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
  },

  // ===== ACTUALIZAR INGREDIENTE EN RECETA =====
  updateIngredient: (recipeId, ingredientId, ingredientData) => {
    const fields = [];
    const params = [];

    Object.keys(ingredientData).forEach(key => {
      if (ingredientData[key] !== undefined && key !== 'id_recipe' && key !== 'id_ingredient') {
        fields.push(`${key} = ?`);
        params.push(ingredientData[key]);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    params.push(recipeId, ingredientId);

    const stmt = db.prepare(`
      UPDATE recipe_ingredients 
      SET ${fields.join(', ')} 
      WHERE id_recipe = ? AND id_ingredient = ?
    `);

    const result = stmt.run(...params);
    return result.changes > 0;
  },

  // ===== REMOVER INGREDIENTE DE RECETA =====
  removeIngredient: (recipeId, ingredientId) => {
    const stmt = db.prepare(`
      DELETE FROM recipe_ingredients 
      WHERE id_recipe = ? AND id_ingredient = ?
    `);

    const result = stmt.run(recipeId, ingredientId);
    return result.changes > 0;
  },

  // ===== REORDENAR PASOS =====
  reorderSteps: (recipeId, stepOrders) => {
    const transaction = db.transaction(() => {
      const stmt = db.prepare('UPDATE recipe_steps SET step_number = ? WHERE id = ?');

      stepOrders.forEach(({ stepId, newOrder }) => {
        stmt.run(newOrder, stepId);
      });

      return true;
    });

    return transaction();
  },

  // ===== REORDENAR INGREDIENTES =====
  reorderIngredients: (recipeId, ingredientOrders) => {
    const transaction = db.transaction(() => {
      const stmt = db.prepare(
        'UPDATE recipe_ingredients SET order_index = ? WHERE id_recipe = ? AND id_ingredient = ?',
      );

      ingredientOrders.forEach(({ ingredientId, newOrder }) => {
        stmt.run(newOrder, recipeId, ingredientId);
      });

      return true;
    });

    return transaction();
  },

  // ===== BUSCAR RECETAS POR INGREDIENTE =====
  searchByIngredient: (ingredientIds, options = {}) => {
    const placeholders = ingredientIds.map(() => '?').join(',');
    let query = `
      SELECT DISTINCT 
        r.*,
        c.name as cocktail_name,
        c.difficulty as cocktail_difficulty,
        COUNT(ri.id_ingredient) as matching_ingredients
      FROM recipes r
      JOIN cocktails c ON r.id_cocktail = c.id
      JOIN recipe_ingredients ri ON r.id = ri.id_recipe
      WHERE ri.id_ingredient IN (${placeholders})
    `;

    if (options.requireAll) {
      query += ` GROUP BY r.id HAVING matching_ingredients = ${ingredientIds.length}`;
    } else {
      query += ' GROUP BY r.id';
    }

    query += ' ORDER BY matching_ingredients DESC, c.name';

    if (options.limit) {
      query += ` LIMIT ${options.limit}`;
    }

    const stmt = db.prepare(query);
    return stmt.all(...ingredientIds);
  },

  // ===== OBTENER RECETAS POR DIFICULTAD =====
  getByDifficulty: difficulty => {
    const stmt = db.prepare(`
      SELECT 
        r.*,
        c.name as cocktail_name,
        c.difficulty as cocktail_difficulty
      FROM recipes r
      JOIN cocktails c ON r.id_cocktail = c.id
      WHERE c.difficulty = ?
      ORDER BY c.name
    `);

    return stmt.all(difficulty);
  },

  // ===== CALCULAR TIEMPO TOTAL DE PREPARACIÓN =====
  calculateTotalTime: recipeId => {
    const stmt = db.prepare(`
      SELECT SUM(duration) as total_duration
      FROM recipe_steps
      WHERE id_recipe = ? AND duration IS NOT NULL
    `);

    const result = stmt.get(recipeId);
    return result.total_duration || 0;
  },

  // ===== VERIFICAR COMPLETITUD DE RECETA =====
  checkCompleteness: recipeId => {
    const recipe = RecipeRepository.getById(recipeId);
    if (!recipe) {
      return null;
    }

    return {
      hasSteps: recipe.steps.length > 0,
      hasIngredients: recipe.ingredients.length > 0,
      hasEssentialIngredients: recipe.ingredients.some(i => i.ingredient_type === 'esencial'),
      hasCriticalSteps: recipe.steps.some(s => s.is_critical),
      completenessScore: calculateCompletenessScore(recipe),
    };
  },
};

// ===== FUNCIÓN AUXILIAR PARA CALCULAR SCORE DE COMPLETITUD =====
const calculateCompletenessScore = recipe => {
  let score = 0;

  // Datos básicos (20 puntos)
  if (recipe.glass_type) {
    score += 5;
  }
  if (recipe.garnish) {
    score += 5;
  }
  if (recipe.serving_suggestion) {
    score += 10;
  }

  // Pasos (40 puntos)
  if (recipe.steps.length > 0) {
    score += 20;
    if (recipe.steps.length >= 3) {
      score += 10;
    }
    if (recipe.steps.some(s => s.duration)) {
      score += 5;
    }
    if (recipe.steps.some(s => s.is_critical)) {
      score += 5;
    }
  }

  // Ingredientes (40 puntos)
  if (recipe.ingredients.length > 0) {
    score += 20;
    if (recipe.ingredients.length >= 3) {
      score += 10;
    }
    if (recipe.ingredients.some(i => i.preparation_note)) {
      score += 5;
    }
    if (recipe.ingredients.some(i => i.ingredient_type === 'esencial')) {
      score += 5;
    }
  }

  return score;
};

export default RecipeRepository;
