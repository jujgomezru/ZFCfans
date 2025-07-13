// ================================
// ÍNDICE DE BASE DE DATOS - UNIFIED
// ================================

// Importaciones para crear objeto repositories
import {
  categoryRepository,
  cocktailRepository,
  favoriteRepository,
  ingredientRepository,
  notificationRepository,
  recipeRepository,
  userRepository,
} from './repositories/index.js';

// Configuración y base de datos
export { default as database } from './config/database.js';

// Repositories (usando nuestra implementación superior)
export {
  cocktailRepository,
  userRepository,
  categoryRepository,
  ingredientRepository,
  favoriteRepository,
  notificationRepository,
  recipeRepository,
} from './repositories/index.js';

// Seeders
export { runAllSeeders } from './seeders/index.js';

// Exportación por defecto - CocktailRepository (compatibilidad con dev)
export { cocktailRepository as default } from './repositories/index.js';

// Alias para compatibilidad con dev branch
export { cocktailRepository as coctelRepository } from './repositories/index.js';

// Función utilitaria para inicializar la base de datos (de dev)
export const initializeDatabase = async () => {
  try {
    const { database } = await import('./config/database.js');
    const info = database.getDatabaseInfo?.() || 'Database initialized';
    return { success: true, info };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Exportar objeto con todos los repositorios (característica de dev)
export const repositories = {
  cocktails: cocktailRepository,
  categories: categoryRepository,
  ingredients: ingredientRepository,
  recipes: recipeRepository,
  users: userRepository,
  notifications: notificationRepository,
  favorites: favoriteRepository,
};
