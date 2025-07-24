/**
 * RecipeController - Controlador para gestión de recetas
 * Maneja la obtención de recetas completas con ingredientes y pasos
 */

class RecipeController {
  /**
   * Obtener receta completa por ID de cóctel
   */
  static async getCompleteRecipe(cocktailId) {
    try {
      if (!cocktailId) {
        throw new Error('ID de cóctel es requerido');
      }

      const recipe = await window.electronAPI.obtenerRecetaCompleta(cocktailId);

      // El backend puede devolver null legítimamente si no encuentra la receta
      // No arrojamos error en este caso, solo devolvemos null
      return recipe;
    } catch (error) {
      // En el frontend usamos console.error para debugging
      // eslint-disable-next-line no-console
      console.error('Error en RecipeController.getCompleteRecipe:', error);
      throw error;
    }
  }

  /**
   * Validar datos de receta antes de enviar
   */
  static validateRecipeData(recipeData) {
    const errors = [];

    if (!recipeData.name || recipeData.name.trim() === '') {
      errors.push('El nombre del cóctel es requerido');
    }

    if (!recipeData.ingredients || recipeData.ingredients.length === 0) {
      errors.push('Se requiere al menos un ingrediente');
    }

    if (!recipeData.steps || recipeData.steps.length === 0) {
      errors.push('Se requiere al menos un paso de preparación');
    }

    // Validar ingredientes
    if (recipeData.ingredients) {
      recipeData.ingredients.forEach((ingredient, index) => {
        if (!ingredient.id_ingredient) {
          errors.push(`Ingrediente ${index + 1}: ID es requerido`);
        }
        if (!ingredient.quantity || ingredient.quantity <= 0) {
          errors.push(`Ingrediente ${index + 1}: Cantidad debe ser mayor a 0`);
        }
      });
    }

    // Validar pasos
    if (recipeData.steps) {
      recipeData.steps.forEach((step, index) => {
        if (!step.instruction || step.instruction.trim() === '') {
          errors.push(`Paso ${index + 1}: Instrucción es requerida`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Formatear receta para mostrar en UI
   */
  static formatRecipeForDisplay(recipe) {
    if (!recipe) {
      return null;
    }

    return {
      ...recipe,
      // Asegurar que los ingredientes tengan el formato correcto
      ingredientes:
        recipe.ingredientes?.map(ingredient => ({
          ...ingredient,
          cantidad: ingredient.cantidad || ingredient.quantity,
          nombre: ingredient.nombre || ingredient.name,
          unidad: ingredient.unidad || ingredient.unit,
        })) || [],
      // Asegurar que los pasos tengan el formato correcto
      pasos:
        recipe.pasos?.map(step => ({
          ...step,
          instruccion: step.instruccion || step.instruction,
          numero: step.numero || step.step_number,
        })) || [],
    };
  }
}

export default RecipeController;
