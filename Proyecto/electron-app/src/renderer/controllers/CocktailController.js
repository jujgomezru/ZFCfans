/**
 * CocktailController - Controlador para gestión de cócteles
 * Actúa como intermediario entre los componentes React y el backend
 */

class CocktailController {
  /**
   * Obtener todos los cócteles con información básica
   */
  static async getAll() {
    try {
      const result = await window.electronAPI.obtenerCocteles();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      console.error('Error en CocktailController.getAll:', error);
      throw error;
    }
  }

  /**
   * Obtener un cóctel por ID
   */
  static async getById(id) {
    try {
      if (!id) {
        throw new Error('ID de cóctel es requerido');
      }
      
      const result = await window.electronAPI.obtenerCoctel(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      console.error('Error en CocktailController.getById:', error);
      throw error;
    }
  }

  /**
   * Buscar cócteles por nombre
   */
  static async search(nombre) {
    try {
      if (!nombre || typeof nombre !== 'string') {
        throw new Error('Nombre de búsqueda es requerido');
      }
      
      const result = await window.electronAPI.buscarCocteles(nombre);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      console.error('Error en CocktailController.search:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo cóctel
   */
  static async create(cocktailData) {
    try {
      if (!cocktailData || !cocktailData.name) {
        throw new Error('Datos del cóctel son requeridos');
      }

      return new Promise((resolve, reject) => {
        // Listener para la respuesta
        const handleResponse = (response) => {
          window.electronAPI.offGuardarCoctelResp?.(handleResponse);
          if (response.success) {
            resolve(response);
          } else {
            reject(new Error(response.error));
          }
        };

        // Registrar listener
        window.electronAPI.onGuardarCoctelResp(handleResponse);
        
        // Enviar datos
        window.electronAPI.guardarCoctel(cocktailData);
      });
    } catch (error) {
      console.error('Error en CocktailController.create:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de cócteles
   */
  static async getStatistics() {
    try {
      const result = await window.electronAPI.obtenerEstadisticas();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      console.error('Error en CocktailController.getStatistics:', error);
      throw error;
    }
  }
}

export default CocktailController;
