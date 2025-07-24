import { useCallback, useEffect, useState } from 'react';
import CocktailController from '../controllers/CocktailController.js';

/**
 * Hook personalizado para gestión de cócteles
 * Proporciona estado y funciones para manejar cócteles
 */
export function useCocktails() {
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todos los cócteles
  const loadCocktails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CocktailController.getAll();
      setCocktails(data || []);
    } catch (err) {
      setError(err.message);
      setCocktails([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar cócteles al montar el componente
  useEffect(() => {
    loadCocktails();
  }, [loadCocktails]);

  // Buscar cócteles
  const searchCocktails = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      await loadCocktails();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await CocktailController.search(searchTerm);
      setCocktails(data || []);
    } catch (err) {
      setError(err.message);
      setCocktails([]);
    } finally {
      setLoading(false);
    }
  }, [loadCocktails]);

  // Crear nuevo cóctel
  const createCocktail = useCallback(async (cocktailData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CocktailController.create(cocktailData);
      await loadCocktails(); // Recargar lista después de crear
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadCocktails]);

  return {
    cocktails,
    loading,
    error,
    loadCocktails,
    searchCocktails,
    createCocktail,
    clearError: () => setError(null),
  };
}

/**
 * Hook para obtener un cóctel específico por ID
 */
export function useCocktail(id) {
  const [cocktail, setCocktail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCocktail = useCallback(async () => {
    if (!id) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await CocktailController.getById(id);
      setCocktail(data);
    } catch (err) {
      setError(err.message);
      setCocktail(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCocktail();
  }, [loadCocktail]);

  return {
    cocktail,
    loading,
    error,
    reload: loadCocktail,
    clearError: () => setError(null),
  };
}

/**
 * Hook para estadísticas de cócteles
 */
export function useCocktailStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CocktailController.getStatistics();
      setStatistics(data);
    } catch (err) {
      setError(err.message);
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  return {
    statistics,
    loading,
    error,
    reload: loadStatistics,
    clearError: () => setError(null),
  };
}
