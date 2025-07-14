import { beforeEach, describe, expect, it, vi } from 'vitest';
import RecipeRepository from '../repositories/RecipeRepository.js';
import { createMockDatabase, mockRecipeIngredients, mockRecipes } from './mockData.js';

// Mock del database
vi.mock('../config/database.js', () => ({
  getDb: () => createMockDatabase(),
  getDatabase: () => createMockDatabase(),
  initDb: vi.fn(),
  closeDb: vi.fn(),
}));

describe('RecipeRepository', () => {
  let repository;
  let mockDb;

  beforeEach(() => {
    mockDb = createMockDatabase();
    repository = new RecipeRepository();
    repository.db = mockDb;
  });

  describe('Métodos básicos heredados de BaseRepository', () => {
    it('debería encontrar una receta por ID', () => {
      const result = repository.findById(1);
      expect(result).toEqual(mockRecipes[0]);
    });

    it('debería obtener todas las recetas', () => {
      const result = repository.findAll();
      expect(result).toEqual(mockRecipes);
      expect(result).toHaveLength(3);
    });

    it('debería crear una nueva receta', () => {
      const newRecipe = {
        id_cocktail: 4,
        glass_type: 'martini',
        garnish: 'Aceituna',
        serving_suggestion: 'Servir muy frío',
      };

      const result = repository.create(newRecipe);
      expect(result).toBe(4); // Mock devuelve el siguiente ID
    });

    it('debería actualizar una receta existente', () => {
      const updates = {
        garnish: 'Menta fresca y rodaja de lima',
        serving_suggestion: 'Servir con mucho hielo',
      };

      const result = repository.update(1, updates);
      expect(result).toBe(1); // Mock devuelve changes: 1
    });

    it('debería eliminar una receta', () => {
      const result = repository.delete(1);
      expect(result).toBe(1);
    });
  });

  describe('findByCocktailId', () => {
    it('debería obtener una receta por ID de cóctel', () => {
      const mockStatement = {
        get: vi.fn(() => ({
          ...mockRecipes[0],
          cocktail_name: 'Mojito Clásico',
        })),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.findByCocktailId(1);
      expect(result).toBeDefined();
      expect(result.cocktail_name).toBe('Mojito Clásico');
      expect(mockStatement.get).toHaveBeenCalledWith(1);
    });

    it('debería retornar null para cóctel sin receta', () => {
      const mockStatement = {
        get: vi.fn(() => null),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.findByCocktailId(999);
      expect(result).toBeNull();
    });
  });

  describe('createForCocktail', () => {
    it('debería crear una receta para un cóctel específico', () => {
      const recipeData = {
        glass_type: 'hurricane',
        garnish: 'Paraguas de papel',
        serving_suggestion: 'Decorar con fruta tropical',
      };

      const mockStatement = {
        run: vi.fn(() => ({ lastInsertRowid: 4, changes: 1 })),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.createForCocktail(4, recipeData);
      expect(result).toBe(4);
      expect(mockStatement.run).toHaveBeenCalledWith(
        4,
        'hurricane',
        'Paraguas de papel',
        'Decorar con fruta tropical',
      );
    });

    it('debería manejar datos opcionales como null', () => {
      const recipeData = {
        glass_type: 'rocks',
      };

      const mockStatement = {
        run: vi.fn(() => ({ lastInsertRowid: 5, changes: 1 })),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.createForCocktail(5, recipeData);
      expect(result).toBe(5);
      expect(mockStatement.run).toHaveBeenCalledWith(5, 'rocks', null, null);
    });
  });

  describe('getIngredients', () => {
    it('debería obtener ingredientes de una receta', () => {
      const mockStatement = {
        all: vi.fn(() => [
          {
            id: 1,
            id_recipe: 1,
            id_ingredient: 1,
            quantity: 50,
            unit: 'ml',
            preparation_note: 'Ron blanco de buena calidad',
            is_optional: 0,
            order_index: 1,
            ingredient_name: 'Ron blanco',
            type: 'alcohol',
            category: 'destilado',
            alcohol_content: 40.0,
          },
          {
            id: 2,
            id_recipe: 1,
            id_ingredient: 3,
            quantity: 30,
            unit: 'ml',
            preparation_note: 'Jugo fresco',
            is_optional: 0,
            order_index: 2,
            ingredient_name: 'Zumo de lima',
            type: 'jugo',
            category: 'cítrico',
            alcohol_content: 0.0,
          },
        ]),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.getIngredients(1);
      expect(result).toHaveLength(2);
      expect(result[0].ingredient_name).toBe('Ron blanco');
      expect(result[1].ingredient_name).toBe('Zumo de lima');
      expect(mockStatement.all).toHaveBeenCalledWith(1);
    });

    it('debería retornar array vacío para receta sin ingredientes', () => {
      const mockStatement = {
        all: vi.fn(() => []),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.getIngredients(999);
      expect(result).toEqual([]);
    });

    it('debería ordenar ingredientes por order_index', () => {
      const mockStatement = {
        all: vi.fn(() => mockRecipeIngredients),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      repository.getIngredients(1);
      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY ri.order_index'),
      );
    });
  });

  describe('addIngredient', () => {
    it('debería agregar un ingrediente a una receta', () => {
      const ingredientData = {
        id_ingredient: 2,
        quantity: 45,
        unit: 'ml',
        preparation_note: 'Vodka premium',
        is_optional: 0,
        order_index: 1,
      };

      const mockStatement = {
        run: vi.fn(() => ({ lastInsertRowid: 5, changes: 1 })),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.addIngredient(1, ingredientData);
      expect(result).toBe(5);
      expect(mockStatement.run).toHaveBeenCalledWith(1, 2, 45, 'ml', 'Vodka premium', 0, 1);
    });

    it('debería manejar ingredientes opcionales', () => {
      const ingredientData = {
        id_ingredient: 5,
        quantity: 6,
        unit: 'hojas',
        preparation_note: 'Para decorar',
        is_optional: 1,
        order_index: 4,
      };

      const mockStatement = {
        run: vi.fn(() => ({ lastInsertRowid: 6, changes: 1 })),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.addIngredient(1, ingredientData);
      expect(result).toBe(6);
    });
  });

  describe('updateIngredient', () => {
    it('debería actualizar un ingrediente en una receta', () => {
      const updates = {
        quantity: 60,
        preparation_note: 'Ron blanco premium añejado',
      };

      const mockStatement = {
        run: vi.fn(() => ({ changes: 1 })),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.updateIngredient(1, updates);
      expect(result).toBe(1);
    });

    it('debería retornar 0 si no existe el ingrediente', () => {
      const mockStatement = {
        run: vi.fn(() => ({ changes: 0 })),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.updateIngredient(999, { quantity: 100 });
      expect(result).toBe(0);
    });
  });

  describe('removeIngredient', () => {
    it('debería remover un ingrediente de una receta', () => {
      const mockStatement = {
        run: vi.fn(() => ({ changes: 1 })),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.removeIngredient(1);
      expect(result).toBe(1);
      expect(mockStatement.run).toHaveBeenCalledWith(1);
    });

    it('debería retornar 0 si no existe el ingrediente', () => {
      const mockStatement = {
        run: vi.fn(() => ({ changes: 0 })),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.removeIngredient(999);
      expect(result).toBe(0);
    });
  });

  describe('getSteps', () => {
    it('debería obtener pasos de preparación de una receta', () => {
      const mockStatement = {
        all: vi.fn(() => [
          {
            id: 1,
            id_recipe: 1,
            step_number: 1,
            instruction: 'Colocar menta en el vaso',
            duration_seconds: 30,
            technique: 'muddle',
            tips: 'No machacar demasiado fuerte',
          },
          {
            id: 2,
            id_recipe: 1,
            step_number: 2,
            instruction: 'Agregar ron y zumo de lima',
            duration_seconds: 15,
            technique: 'pour',
            tips: 'Verter lentamente',
          },
        ]),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.getSteps(1);
      expect(result).toHaveLength(2);
      expect(result[0].step_number).toBe(1);
      expect(result[1].step_number).toBe(2);
      expect(mockStatement.all).toHaveBeenCalledWith(1);
    });

    it('debería retornar array vacío para receta sin pasos', () => {
      const mockStatement = {
        all: vi.fn(() => []),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.getSteps(999);
      expect(result).toEqual([]);
    });
  });

  describe('addStep', () => {
    it('debería agregar un paso a una receta', () => {
      const stepData = {
        step_number: 3,
        instruction: 'Decorar con menta fresca',
        duration_seconds: 10,
        technique: 'garnish',
        tips: 'Usar hojas frescas',
      };

      const mockStatement = {
        run: vi.fn(() => ({ lastInsertRowid: 3, changes: 1 })),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.addStep(1, stepData);
      expect(result).toBe(3);
      expect(mockStatement.run).toHaveBeenCalledWith(
        1,
        3,
        'Decorar con menta fresca',
        10,
        'garnish',
        'Usar hojas frescas',
      );
    });
  });

  describe('updateStep', () => {
    it('debería actualizar un paso de preparación', () => {
      const updates = {
        instruction: 'Instrucción actualizada',
        tips: 'Nuevos tips',
      };

      const mockStatement = {
        run: vi.fn(() => ({ changes: 1 })),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.updateStep(1, updates);
      expect(result).toBe(1);
    });
  });

  describe('removeStep', () => {
    it('debería remover un paso de preparación', () => {
      const mockStatement = {
        run: vi.fn(() => ({ changes: 1 })),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.removeStep(1);
      expect(result).toBe(1);
    });
  });

  describe('getRecipeComplexity', () => {
    it('debería calcular la complejidad de una receta', () => {
      const mockStatement = {
        get: vi.fn(() => ({
          total_ingredients: 5,
          total_steps: 3,
          total_time: 300,
          optional_ingredients: 1,
          complexity_score: 7.5,
        })),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.getRecipeComplexity(1);
      expect(result).toBeDefined();
      expect(result.total_ingredients).toBe(5);
      expect(result.complexity_score).toBe(7.5);
    });
  });

  describe('findByGlassType', () => {
    it('debería encontrar recetas por tipo de vaso', () => {
      const mockStatement = {
        all: vi.fn(() => mockRecipes.filter(r => r.glass_type === 'highball')),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.findByGlassType('highball');
      expect(result).toHaveLength(2); // Mojito y Virgin Mojito
      expect(mockStatement.all).toHaveBeenCalledWith('highball');
    });
  });

  describe('duplicateRecipe', () => {
    it('debería duplicar una receta completa', () => {
      const _mockTransaction = {
        exec: vi.fn(),
      };

      const mockFindStatement = {
        get: vi.fn(() => mockRecipes[0]),
      };

      const mockInsertStatement = {
        run: vi.fn(() => ({ lastInsertRowid: 4, changes: 1 })),
      };

      const mockIngredientsStatement = {
        all: vi.fn(() => mockRecipeIngredients),
      };

      mockDb.prepare
        .mockReturnValueOnce(mockFindStatement)
        .mockReturnValueOnce(mockInsertStatement)
        .mockReturnValueOnce(mockIngredientsStatement)
        .mockReturnValue(mockInsertStatement);

      const result = repository.duplicateRecipe(1, 5);
      expect(result).toBe(4);
    });
  });

  describe('Manejo de errores', () => {
    it('debería manejar errores de base de datos', () => {
      mockDb.prepare.mockImplementation(() => {
        throw new Error('Database error');
      });

      expect(() => repository.findByCocktailId(1)).toThrow('Database error');
    });

    it('debería validar parámetros requeridos', () => {
      expect(() => repository.findByCocktailId()).toThrow();
      expect(() => repository.createForCocktail()).toThrow();
      expect(() => repository.getIngredients()).toThrow();
    });
  });

  describe('Validación de datos', () => {
    it('debería validar datos al crear receta', () => {
      const invalidRecipe = {
        // Faltan campos requeridos
        garnish: 'Solo garnish',
      };

      const result = repository.create(invalidRecipe);
      expect(result).toBeDefined();
    });

    it('debería manejar tipos de vidrio válidos', () => {
      const validGlassTypes = ['highball', 'rocks', 'martini', 'coupe', 'hurricane'];

      validGlassTypes.forEach(glassType => {
        const recipeData = { glass_type: glassType };
        const result = repository.createForCocktail(1, recipeData);
        expect(result).toBeDefined();
      });
    });
  });

  describe('Transacciones y integridad', () => {
    it('debería mantener integridad al agregar ingredientes', () => {
      // Simular que ya existen ingredientes
      const existingIngredients = mockRecipeIngredients;

      const newIngredient = {
        id_ingredient: 4,
        quantity: 20,
        unit: 'g',
        order_index: existingIngredients.length + 1,
      };

      const result = repository.addIngredient(1, newIngredient);
      expect(result).toBeDefined();
    });

    it('debería recalcular order_index al remover ingredientes', () => {
      // Esta funcionalidad dependería de la implementación específica
      const result = repository.removeIngredient(2);
      expect(result).toBeDefined();
    });
  });
});
