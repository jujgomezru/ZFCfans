import { useCallback, useEffect, useState } from 'react';
import RecipeController from '../controllers/RecipeController.js';

/**
 * Hook para gestión de recetas completas
 */
export function useRecipe(cocktailId) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRecipe = useCallback(async () => {
    if (!cocktailId) {
      setRecipe(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await RecipeController.getCompleteRecipe(cocktailId);
      setRecipe(data);
    } catch (err) {
      setError(err.message);
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }, [cocktailId]);

  useEffect(() => {
    loadRecipe();
  }, [loadRecipe]);

  return {
    recipe,
    loading,
    error,
    reload: loadRecipe,
    clearError: () => setError(null),
  };
}

/**
 * Hook para validación de recetas
 */
export function useRecipeValidation() {
  const [validationResult, setValidationResult] = useState(null);

  const validateRecipe = useCallback(recipeData => {
    const result = RecipeController.validateRecipeData(recipeData);
    setValidationResult(result);
    return result;
  }, []);

  const clearValidation = useCallback(() => {
    setValidationResult(null);
  }, []);

  return {
    validationResult,
    validateRecipe,
    clearValidation,
    isValid: validationResult?.isValid ?? true,
    errors: validationResult?.errors ?? [],
  };
}
