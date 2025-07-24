import { useCallback, useState } from 'react';
import SearchController from '../controllers/SearchController';

/**
 * Hook para gestión de búsqueda y filtrado de cócteles
 */
export function useSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [lastSearch, setLastSearch] = useState(null);

  /**
   * Buscar cócteles con filtros múltiples
   */
  const searchWithFilters = useCallback(async filters => {
    try {
      setLoading(true);
      setError(null);

      const validatedFilters = SearchController.validateFilters(filters);
      const data = await SearchController.searchWithFilters(validatedFilters);

      setResults(data || []);
      setLastSearch({ type: 'filters', params: validatedFilters });

      return data;
    } catch (err) {
      setError(err.message);
      setResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Buscar cócteles por texto simple
   */
  const searchByText = useCallback(async searchTerm => {
    try {
      setLoading(true);
      setError(null);

      const filters = { search: searchTerm };
      const data = await SearchController.searchWithFilters(filters);

      setResults(data || []);
      setLastSearch({ type: 'text', params: searchTerm });

      return data;
    } catch (err) {
      setError(err.message);
      setResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Búsqueda fuzzy (tolerante a errores)
   */
  const fuzzySearch = useCallback(async searchTerm => {
    try {
      setLoading(true);
      setError(null);

      const data = await SearchController.fuzzySearch(searchTerm);

      setResults(data || []);
      setLastSearch({ type: 'fuzzy', params: searchTerm });

      return data;
    } catch (err) {
      setError(err.message);
      setResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Buscar por ingredientes
   */
  const searchByIngredients = useCallback(async ingredients => {
    try {
      setLoading(true);
      setError(null);

      const data = await SearchController.searchByIngredients(ingredients);

      setResults(data || []);
      setLastSearch({ type: 'ingredients', params: ingredients });

      return data;
    } catch (err) {
      setError(err.message);
      setResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Buscar por dificultad
   */
  const searchByDifficulty = useCallback(async difficulty => {
    try {
      setLoading(true);
      setError(null);

      const data = await SearchController.searchByDifficulty(difficulty);

      setResults(data || []);
      setLastSearch({ type: 'difficulty', params: difficulty });

      return data;
    } catch (err) {
      setError(err.message);
      setResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Buscar por categoría
   */
  const searchByCategory = useCallback(async categoryId => {
    try {
      setLoading(true);
      setError(null);

      const data = await SearchController.searchByCategory(categoryId);

      setResults(data || []);
      setLastSearch({ type: 'category', params: categoryId });

      return data;
    } catch (err) {
      setError(err.message);
      setResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener sugerencias de autocompletar
   */
  const getSuggestions = useCallback(async (term, limit = 10) => {
    try {
      if (!term || term.length < 2) {
        setSuggestions([]);
        return [];
      }

      const data = await SearchController.getSearchSuggestions(term, limit);
      setSuggestions(data || []);

      return data;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error getting suggestions:', err);
      setSuggestions([]);
      return [];
    }
  }, []);

  /**
   * Limpiar resultados
   */
  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setLastSearch(null);
  }, []);

  /**
   * Limpiar sugerencias
   */
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  /**
   * Repetir última búsqueda
   */
  const repeatLastSearch = useCallback(async () => {
    if (!lastSearch) {
      return [];
    }

    switch (lastSearch.type) {
      case 'filters':
        return searchWithFilters(lastSearch.params);
      case 'text':
        return searchByText(lastSearch.params);
      case 'fuzzy':
        return fuzzySearch(lastSearch.params);
      case 'ingredients':
        return searchByIngredients(lastSearch.params);
      case 'difficulty':
        return searchByDifficulty(lastSearch.params);
      case 'category':
        return searchByCategory(lastSearch.params);
      default:
        return [];
    }
  }, [
    lastSearch,
    searchWithFilters,
    searchByText,
    fuzzySearch,
    searchByIngredients,
    searchByDifficulty,
    searchByCategory,
  ]);

  return {
    // Estado
    results,
    loading,
    error,
    suggestions,
    lastSearch,

    // Métodos de búsqueda
    searchWithFilters,
    searchByText,
    fuzzySearch,
    searchByIngredients,
    searchByDifficulty,
    searchByCategory,

    // Utilidades
    getSuggestions,
    clearResults,
    clearSuggestions,
    repeatLastSearch,
  };
}
