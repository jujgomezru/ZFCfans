// Configuración y base de datos
export { default as database } from './config/database.js';

// Repositories
export {
  cocktailRepository,
  userRepository,
  categoryRepository,
  ingredientRepository,
  favoriteRepository,
} from './repositories/index.js';

// Seeders
export { runAllSeeders } from './seeders/index.js';

// Exportación por defecto - ahora apunta directamente al CocktailRepository
export { cocktailRepository as default } from './repositories/index.js';
