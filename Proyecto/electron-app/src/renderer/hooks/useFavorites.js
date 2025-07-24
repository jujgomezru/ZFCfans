import { useCallback, useState } from 'react';
import FavoriteController from '../controllers/FavoriteController';

/**
 * Hook para gestión de favoritos
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Usuario demo por defecto (en una app real vendría del contexto de autenticación)
  const DEMO_USER_ID = 1;

  /**
   * Cargar favoritos del usuario
   */
  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FavoriteController.getFavorites(DEMO_USER_ID);
      setFavorites(data || []);
    } catch (err) {
      setError(err.message);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Verificar si un cóctel es favorito
   */
  const isFavorite = useCallback(async cocktailId => {
    try {
      const result = await FavoriteController.isFavorite(DEMO_USER_ID, cocktailId);
      return result;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  /**
   * Alternar estado de favorito
   */
  const toggleFavorite = useCallback(
    async cocktailId => {
      try {
        setError(null);
        const result = await FavoriteController.toggleFavorite(DEMO_USER_ID, cocktailId);

        // Recargar favoritos para mantener la lista actualizada
        await loadFavorites();

        return result;
      } catch (err) {
        setError(err.message);
        return { added: false, removed: false };
      }
    },
    [loadFavorites],
  );

  /**
   * Agregar a favoritos
   */
  const addFavorite = useCallback(
    async cocktailId => {
      try {
        setError(null);
        const result = await FavoriteController.addFavorite(DEMO_USER_ID, cocktailId);

        // Recargar favoritos para mantener la lista actualizada
        await loadFavorites();

        return result;
      } catch (err) {
        setError(err.message);
        return null;
      }
    },
    [loadFavorites],
  );

  /**
   * Remover de favoritos
   */
  const removeFavorite = useCallback(
    async cocktailId => {
      try {
        setError(null);
        const result = await FavoriteController.removeFavorite(DEMO_USER_ID, cocktailId);

        // Recargar favoritos para mantener la lista actualizada
        await loadFavorites();

        return result;
      } catch (err) {
        setError(err.message);
        return 0;
      }
    },
    [loadFavorites],
  );

  return {
    favorites,
    loading,
    error,
    loadFavorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
  };
}
