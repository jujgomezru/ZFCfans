// Repositories
import CocktailRepository from './CocktailRepository.js';
import UserRepository from './UserRepository.js';
import CategoryRepository from './CategoryRepository.js';
import IngredientRepository from './IngredientRepository.js';
import FavoriteRepository from './FavoriteRepository.js';

// Instancias singleton
const cocktailRepository = new CocktailRepository();
const userRepository = new UserRepository();
const categoryRepository = new CategoryRepository();
const ingredientRepository = new IngredientRepository();
const favoriteRepository = new FavoriteRepository();

// Exportar instancias
export {
  cocktailRepository,
  userRepository,
  categoryRepository,
  ingredientRepository,
  favoriteRepository,
};

// Exportar también como default para retrocompatibilidad
export default cocktailRepository;
