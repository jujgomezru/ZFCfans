import { beforeEach, describe, expect, test, vi } from 'vitest';
import { mockBetterSqlite3, mockIngredients } from './mockData.js';
import IngredientRepository from '../repositories/IngredientRepository.js';

// Mock better-sqlite3
mockBetterSqlite3();

describe('IngredientRepository', () => {
  let ingredientRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    ingredientRepository = new IngredientRepository();
  });

  describe('findByName', () => {
    test('should find ingredient by name', () => {
      const mockStmt = {
        get: vi.fn(() => mockIngredients.find(i => i.name === 'Ron blanco')),
      };
      ingredientRepository.db.prepare.mockReturnValue(mockStmt);

      const ingredient = ingredientRepository.findByName('Ron blanco');

      expect(ingredient).toBeDefined();
      expect(ingredient.name).toBe('Ron blanco');
      expect(ingredient.alcohol_content).toBe(40.0);
    });

    test('should return null for non-existent ingredient', () => {
      const mockStmt = {
        get: vi.fn(() => null),
      };
      ingredientRepository.db.prepare.mockReturnValue(mockStmt);

      const ingredient = ingredientRepository.findByName('Ingrediente Inexistente');

      expect(ingredient).toBeNull();
    });
  });

  describe('createIfNotExists', () => {
    test('should return existing ingredient id if found', () => {
      const existingIngredient = mockIngredients.find(i => i.name === 'Vodka');
      const mockStmt = {
        get: vi.fn(() => existingIngredient),
      };
      ingredientRepository.db.prepare.mockReturnValue(mockStmt);

      const ingredientId = ingredientRepository.createIfNotExists('Vodka');

      expect(ingredientId).toBe(existingIngredient.id);
    });

    test('should create new ingredient if not found', () => {
      const mockFindStmt = {
        get: vi.fn(() => null), // No existe
      };
      const mockCreateStmt = {
        run: vi.fn(() => ({ lastInsertRowid: 10, changes: 1 })),
      };

      ingredientRepository.db.prepare
        .mockReturnValueOnce(mockFindStmt) // Para findByName
        .mockReturnValueOnce(mockCreateStmt); // Para createIngredient

      const ingredientId = ingredientRepository.createIfNotExists('Nuevo Ingrediente', 'g');

      expect(ingredientId).toBe(10);
      expect(mockCreateStmt.run).toHaveBeenCalled();
    });

    test('should use default unit type if not provided', () => {
      const mockFindStmt = {
        get: vi.fn(() => null),
      };
      const mockCreateStmt = {
        run: vi.fn(() => ({ lastInsertRowid: 11, changes: 1 })),
      };

      ingredientRepository.db.prepare
        .mockReturnValueOnce(mockFindStmt)
        .mockReturnValueOnce(mockCreateStmt);

      // Mock createIngredient para verificar que se llame con ml por defecto
      const originalCreateIngredient = ingredientRepository.createIngredient;
      ingredientRepository.createIngredient = vi.fn(() => 11);

      const _ingredientId = ingredientRepository.createIfNotExists('Ingrediente con ML');

      expect(ingredientRepository.createIngredient).toHaveBeenCalledWith({
        name: 'Ingrediente con ML',
        unit_type: 'ml',
      });

      // Restaurar método original
      ingredientRepository.createIngredient = originalCreateIngredient;
    });
  });

  describe('createIngredient', () => {
    test('should create ingredient with all provided data', () => {
      const mockStmt = {
        run: vi.fn(() => ({ lastInsertRowid: 15, changes: 1 })),
      };
      ingredientRepository.db.prepare.mockReturnValue(mockStmt);

      const ingredientData = {
        name: 'Ginebra Premium',
        description: 'Ginebra destilada artesanalmente',
        unit_type: 'ml',
        alcohol_content: 42.0,
      };

      const ingredientId = ingredientRepository.createIngredient(ingredientData);

      expect(mockStmt.run).toHaveBeenCalledWith(
        'Ginebra Premium',
        'Ginebra destilada artesanalmente',
        'ml',
        42.0,
      );
      expect(ingredientId).toBe(15);
    });

    test('should create ingredient with minimal data', () => {
      const mockStmt = {
        run: vi.fn(() => ({ lastInsertRowid: 16, changes: 1 })),
      };
      ingredientRepository.db.prepare.mockReturnValue(mockStmt);

      const ingredientData = {
        name: 'Ingrediente Básico',
        unit_type: 'ml',
      };

      const ingredientId = ingredientRepository.createIngredient(ingredientData);

      expect(mockStmt.run).toHaveBeenCalledWith('Ingrediente Básico', undefined, 'ml', undefined);
      expect(ingredientId).toBe(16);
    });
  });

  describe('searchByName', () => {
    test('should find ingredients matching pattern', () => {
      const searchPattern = 'ron%';
      const expectedResults = mockIngredients.filter(i => i.name.toLowerCase().includes('ron'));

      const mockStmt = {
        all: vi.fn(() => expectedResults),
      };
      ingredientRepository.db.prepare.mockReturnValue(mockStmt);

      const results = ingredientRepository.searchByName(searchPattern);

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Ron blanco');
      expect(ingredientRepository.db.prepare).toHaveBeenCalledWith(
        'SELECT * FROM ingredients WHERE name LIKE ? ORDER BY name',
      );
    });

    test('should return empty array if no matches found', () => {
      const mockStmt = {
        all: vi.fn(() => []),
      };
      ingredientRepository.db.prepare.mockReturnValue(mockStmt);

      const results = ingredientRepository.searchByName('xyz%');

      expect(results).toHaveLength(0);
    });
  });

  describe('getAlcoholicIngredients', () => {
    test('should return only alcoholic ingredients', () => {
      const alcoholicIngredients = mockIngredients.filter(i => i.alcohol_content > 0);
      const mockStmt = {
        all: vi.fn(() => alcoholicIngredients),
      };
      ingredientRepository.db.prepare.mockReturnValue(mockStmt);

      const results = ingredientRepository.getAlcoholicIngredients();

      expect(results.length).toBeGreaterThan(0);
      results.forEach(ingredient => {
        expect(ingredient.alcohol_content).toBeGreaterThan(0);
      });
    });
  });

  describe('getNonAlcoholicIngredients', () => {
    test('should return only non-alcoholic ingredients', () => {
      const nonAlcoholicIngredients = mockIngredients.filter(i => i.alcohol_content === 0);
      const mockStmt = {
        all: vi.fn(() => nonAlcoholicIngredients),
      };
      ingredientRepository.db.prepare.mockReturnValue(mockStmt);

      const results = ingredientRepository.getNonAlcoholicIngredients();

      expect(results.length).toBeGreaterThan(0);
      results.forEach(ingredient => {
        expect(ingredient.alcohol_content).toBe(0);
      });
    });
  });

  describe('inherited methods from BaseRepository', () => {
    test('should use correct table name and primary key', () => {
      expect(ingredientRepository.tableName).toBe('ingredients');
      expect(ingredientRepository.primaryKey).toBe('id');
    });

    test('should find ingredient by id', () => {
      const ingredientId = 1;
      const mockStmt = {
        get: vi.fn(() => mockIngredients.find(i => i.id === ingredientId)),
      };
      ingredientRepository.db.prepare.mockReturnValue(mockStmt);

      const ingredient = ingredientRepository.findById(ingredientId);

      expect(ingredient).toBeDefined();
      expect(ingredient.id).toBe(ingredientId);
      expect(ingredient.name).toBe('Ron blanco');
    });

    test('should get all ingredients', () => {
      const mockStmt = {
        all: vi.fn(() => mockIngredients),
      };
      ingredientRepository.db.prepare.mockReturnValue(mockStmt);

      const ingredients = ingredientRepository.findAll();

      expect(ingredients).toHaveLength(mockIngredients.length);
    });
  });

  describe('edge cases and error handling', () => {
    test('should handle duplicate ingredient names', () => {
      const mockStmt = {
        run: vi.fn(() => {
          throw new Error('UNIQUE constraint failed: ingredients.name');
        }),
      };
      ingredientRepository.db.prepare.mockReturnValue(mockStmt);

      expect(() => {
        ingredientRepository.createIngredient({
          name: 'Vodka', // Nombre duplicado
          unit_type: 'ml',
        });
      }).toThrow('UNIQUE constraint failed');
    });

    test('should handle invalid alcohol content', () => {
      const mockStmt = {
        run: vi.fn(() => {
          throw new Error('CHECK constraint failed: alcohol_content >= 0');
        }),
      };
      ingredientRepository.db.prepare.mockReturnValue(mockStmt);

      expect(() => {
        ingredientRepository.createIngredient({
          name: 'Ingrediente Inválido',
          unit_type: 'ml',
          alcohol_content: -5, // Valor inválido
        });
      }).toThrow('CHECK constraint failed');
    });

    test('should handle database connection errors', () => {
      const mockStmt = {
        get: vi.fn(() => {
          throw new Error('Database connection lost');
        }),
      };
      ingredientRepository.db.prepare.mockReturnValue(mockStmt);

      expect(() => {
        ingredientRepository.findByName('Any Ingredient');
      }).toThrow('Database connection lost');
    });
  });
});
