/**
 * FavoriteController - Controlador para gestión de favoritos
 * Actúa como intermediario entre los componentes React y el backend
 */

class FavoriteController {
  /**
   * Obtener favoritos de un usuario
   */
  static async getFavorites(userId) {
    try {
      if (!userId) {
        throw new Error('User ID es requerido');
      }

      const result = await window.electronAPI.obtenerFavoritos(userId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en FavoriteController.getFavorites:', error);
      throw error;
    }
  }

  /**
   * Verificar si un cóctel es favorito
   */
  static async isFavorite(userId, cocktailId) {
    try {
      if (!userId || !cocktailId) {
        throw new Error('User ID y Cocktail ID son requeridos');
      }

      const result = await window.electronAPI.esFavorito(userId, cocktailId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en FavoriteController.isFavorite:', error);
      throw error;
    }
  }

  /**
   * Alternar estado de favorito
   */
  static async toggleFavorite(userId, cocktailId) {
    try {
      if (!userId || !cocktailId) {
        throw new Error('User ID y Cocktail ID son requeridos');
      }

      const result = await window.electronAPI.toggleFavorito(userId, cocktailId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en FavoriteController.toggleFavorite:', error);
      throw error;
    }
  }

  /**
   * Agregar a favoritos
   */
  static async addFavorite(userId, cocktailId) {
    try {
      if (!userId || !cocktailId) {
        throw new Error('User ID y Cocktail ID son requeridos');
      }

      const result = await window.electronAPI.agregarFavorito(userId, cocktailId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en FavoriteController.addFavorite:', error);
      throw error;
    }
  }

  /**
   * Remover de favoritos
   */
  static async removeFavorite(userId, cocktailId) {
    try {
      if (!userId || !cocktailId) {
        throw new Error('User ID y Cocktail ID son requeridos');
      }

      const result = await window.electronAPI.removerFavorito(userId, cocktailId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en FavoriteController.removeFavorite:', error);
      throw error;
    }
  }
}

export default FavoriteController;
