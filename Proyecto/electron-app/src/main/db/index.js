// ================================
// ÍNDICE DE BASE DE DATOS
// ================================

// Importar todos los repositorios
import coctelRepository from './coctelRepository.js';
import categoryRepository from './categoryRepository.js';
import ingredientRepository from './ingredientRepository.js';
import recipeRepository from './recipeRepository.js';
import userRepository from './userRepository.js';
import notificationRepository from './notificationRepository.js';
import database from './database.js';

// Exportar como default el repositorio principal (compatibilidad)
export default coctelRepository;

// Exportar todos los repositorios individualmente
export {
  coctelRepository,
  categoryRepository,
  ingredientRepository,
  recipeRepository,
  userRepository,
  notificationRepository,
  database,
};

// Exportar objeto con todos los repositorios
export const repositories = {
  cocktails: coctelRepository,
  categories: categoryRepository,
  ingredients: ingredientRepository,
  recipes: recipeRepository,
  users: userRepository,
  notifications: notificationRepository,
};

// Función utilitaria para inicializar la base de datos
export const initializeDatabase = async () => {
  try {
    const info = database.getDatabaseInfo();
    return { success: true, info };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
