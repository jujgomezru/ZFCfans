/**
 * CategoryController - Controlador para gestión de categorías
 * Actúa como intermediario entre los componentes React y el backend
 */

class CategoryController {
  /**
   * Obtener todas las categorías
   */
  static async getAll() {
    try {
      const result = await window.electronAPI.obtenerCategorias();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en CategoryController.getAll:', error);
      throw error;
    }
  }

  /**
   * Obtener categorías del sistema
   */
  static async getSystemCategories() {
    try {
      const result = await window.electronAPI.obtenerCategoriasDelSistema();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en CategoryController.getSystemCategories:', error);
      throw error;
    }
  }

  /**
   * Obtener categorías del usuario
   */
  static async getUserCategories(userId) {
    try {
      const result = await window.electronAPI.obtenerCategoriasDelUsuario(userId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en CategoryController.getUserCategories:', error);
      throw error;
    }
  }

  /**
   * Crear nueva categoría
   */
  static async create(categoryData) {
    try {
      if (!categoryData || !categoryData.name) {
        throw new Error('Datos de la categoría son requeridos');
      }

      const result = await window.electronAPI.crearCategoria(categoryData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en CategoryController.create:', error);
      throw error;
    }
  }

  /**
   * Obtener cócteles de una categoría
   */
  static async getCocktails(categoryId) {
    try {
      if (!categoryId) {
        throw new Error('Category ID es requerido');
      }

      const result = await window.electronAPI.obtenerCoctelesDeCategoria(categoryId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en CategoryController.getCocktails:', error);
      throw error;
    }
  }

  /**
   * Agregar cóctel a categoría
   */
  static async addCocktailToCategory(cocktailId, categoryId) {
    try {
      if (!cocktailId || !categoryId) {
        throw new Error('Cocktail ID y Category ID son requeridos');
      }

      const result = await window.electronAPI.agregarCoctelACategoria(cocktailId, categoryId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en CategoryController.addCocktailToCategory:', error);
      throw error;
    }
  }

  /**
   * Remover cóctel de categoría
   */
  static async removeCocktailFromCategory(cocktailId, categoryId) {
    try {
      if (!cocktailId || !categoryId) {
        throw new Error('Cocktail ID y Category ID son requeridos');
      }

      const result = await window.electronAPI.removerCoctelDeCategoria(cocktailId, categoryId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en CategoryController.removeCocktailFromCategory:', error);
      throw error;
    }
  }

  /**
   * Obtener categorías de un cóctel
   */
  static async getCocktailCategories(cocktailId) {
    try {
      if (!cocktailId) {
        throw new Error('Cocktail ID es requerido');
      }

      const result = await window.electronAPI.obtenerCategoriasDelCoctel(cocktailId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en CategoryController.getCocktailCategories:', error);
      throw error;
    }
  }
}

export default CategoryController;
