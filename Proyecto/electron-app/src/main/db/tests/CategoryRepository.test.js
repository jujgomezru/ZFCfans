import { beforeEach, describe, expect, test, vi } from 'vitest';
import { mockBetterSqlite3, mockCategories } from './mockData.js';
import CategoryRepository from '../repositories/CategoryRepository.js';

// Mock better-sqlite3
mockBetterSqlite3();

describe('CategoryRepository', () => {
  let categoryRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    categoryRepository = new CategoryRepository();
  });

  describe('findByName', () => {
    test('should find category by name', () => {
      const mockStmt = {
        get: vi.fn(() => mockCategories.find(c => c.name === 'Favoritos')),
      };
      categoryRepository.db.prepare.mockReturnValue(mockStmt);

      const category = categoryRepository.findByName('Favoritos');

      expect(category).toBeDefined();
      expect(category.name).toBe('Favoritos');
      expect(category.is_system).toBe(1);
    });

    test('should return null for non-existent category', () => {
      const mockStmt = {
        get: vi.fn(() => null),
      };
      categoryRepository.db.prepare.mockReturnValue(mockStmt);

      const category = categoryRepository.findByName('Non-existent Category');

      expect(category).toBeNull();
    });
  });

  describe('findSystemCategories', () => {
    test('should return only system categories', () => {
      const systemCategories = mockCategories.filter(c => c.is_system === 1);
      const mockStmt = {
        all: vi.fn(() => systemCategories),
      };
      categoryRepository.db.prepare.mockReturnValue(mockStmt);

      const categories = categoryRepository.findSystemCategories();

      expect(categories).toHaveLength(1);
      expect(categories[0].name).toBe('Favoritos');
      expect(categories[0].is_system).toBe(1);
      expect(categoryRepository.db.prepare).toHaveBeenCalledWith(
        'SELECT * FROM categories WHERE is_system = 1 ORDER BY name',
      );
    });

    test('should return empty array if no system categories exist', () => {
      const mockStmt = {
        all: vi.fn(() => []),
      };
      categoryRepository.db.prepare.mockReturnValue(mockStmt);

      const categories = categoryRepository.findSystemCategories();

      expect(categories).toHaveLength(0);
    });
  });

  describe('findUserCategories', () => {
    test('should return user categories without userId filter', () => {
      const userCategories = mockCategories.filter(c => c.is_system === 0);
      const mockStmt = {
        all: vi.fn(() => userCategories),
      };
      categoryRepository.db.prepare.mockReturnValue(mockStmt);

      const categories = categoryRepository.findUserCategories();

      expect(categories.length).toBeGreaterThan(0);
      categories.forEach(category => {
        expect(category.is_system).toBe(0);
      });
    });

    test('should return user categories filtered by userId', () => {
      const userId = 1;
      const userCategories = mockCategories.filter(c => c.is_system === 0 && c.id_owner === userId);
      const mockStmt = {
        all: vi.fn(() => userCategories),
      };
      categoryRepository.db.prepare.mockReturnValue(mockStmt);

      const categories = categoryRepository.findUserCategories(userId);

      expect(categories.length).toBe(2); // Aperitivos y Digestivos
      categories.forEach(category => {
        expect(category.is_system).toBe(0);
        expect(category.id_owner).toBe(userId);
      });
    });
  });

  describe('createCategory', () => {
    test('should create a new category with required fields', () => {
      const mockStmt = {
        run: vi.fn(() => ({ lastInsertRowid: 5, changes: 1 })),
      };
      categoryRepository.db.prepare.mockReturnValue(mockStmt);

      const categoryData = {
        name: 'Nueva Categoría',
        description: 'Descripción de la nueva categoría',
        color: '#FF5733',
        is_system: 0,
        id_owner: 1,
      };

      const categoryId = categoryRepository.createCategory(categoryData);

      expect(mockStmt.run).toHaveBeenCalledWith(
        'Nueva Categoría',
        'Descripción de la nueva categoría',
        '#FF5733',
        0,
        1,
      );
      expect(categoryId).toBe(5);
    });

    test('should create category with default values', () => {
      const mockStmt = {
        run: vi.fn(() => ({ lastInsertRowid: 6, changes: 1 })),
      };
      categoryRepository.db.prepare.mockReturnValue(mockStmt);

      const categoryData = {
        name: 'Categoría Mínima',
      };

      const categoryId = categoryRepository.createCategory(categoryData);

      expect(mockStmt.run).toHaveBeenCalledWith(
        'Categoría Mínima',
        null, // description default
        '#6B7280', // color default
        0, // is_system default
        null, // id_owner default
      );
      expect(categoryId).toBe(6);
    });
  });

  describe('getCocktails', () => {
    test('should return cocktails for a specific category', () => {
      const categoryId = 2; // Aperitivos
      const expectedCocktails = [
        {
          id: 1,
          nombre: 'Mojito Clásico',
          imagen: 'https://example.com/mojito.jpg',
          dificultad: 'fácil',
          descripcion: 'El clásico cóctel cubano con menta y lima',
        },
        {
          id: 2,
          nombre: 'Moscow Mule',
          imagen: 'https://example.com/moscow_mule.jpg',
          dificultad: 'fácil',
          descripcion: 'Cóctel refrescante con vodka y ginger beer',
        },
      ];

      const mockStmt = {
        all: vi.fn(() => expectedCocktails),
      };
      categoryRepository.db.prepare.mockReturnValue(mockStmt);

      const cocktails = categoryRepository.getCocktails(categoryId);

      expect(cocktails).toHaveLength(2);
      expect(cocktails[0].nombre).toBe('Mojito Clásico');
      expect(cocktails[1].nombre).toBe('Moscow Mule');
      expect(mockStmt.all).toHaveBeenCalledWith(categoryId);
    });

    test('should return empty array for category with no cocktails', () => {
      const categoryId = 999; // Categoría sin cócteles
      const mockStmt = {
        all: vi.fn(() => []),
      };
      categoryRepository.db.prepare.mockReturnValue(mockStmt);

      const cocktails = categoryRepository.getCocktails(categoryId);

      expect(cocktails).toHaveLength(0);
    });
  });

  describe('countCocktails', () => {
    test('should return correct cocktail count for category', () => {
      const categoryId = 2;
      const mockStmt = {
        get: vi.fn(() => ({ count: 3 })),
      };
      categoryRepository.db.prepare.mockReturnValue(mockStmt);

      const count = categoryRepository.countCocktails(categoryId);

      expect(count).toBe(3);
      expect(categoryRepository.db.prepare).toHaveBeenCalledTimes(1);
      // Verificar que se llamó con una consulta que contenga las palabras clave
      const calledQuery = categoryRepository.db.prepare.mock.calls[0][0];
      expect(calledQuery).toMatch(/SELECT/i);
      expect(calledQuery).toMatch(/COUNT/i);
      expect(calledQuery).toMatch(/cocktail_categories/i);
      expect(calledQuery).toMatch(/id_category/i);
    });

    test('should return 0 for category with no cocktails', () => {
      const categoryId = 999;
      const mockStmt = {
        get: vi.fn(() => ({ count: 0 })),
      };
      categoryRepository.db.prepare.mockReturnValue(mockStmt);

      const count = categoryRepository.countCocktails(categoryId);

      expect(count).toBe(0);
    });
  });

  describe('inherited methods from BaseRepository', () => {
    test('should use correct table name and primary key', () => {
      expect(categoryRepository.tableName).toBe('categories');
      expect(categoryRepository.primaryKey).toBe('id');
    });

    test('should find category by id', () => {
      const categoryId = 1;
      const mockStmt = {
        get: vi.fn(() => mockCategories.find(c => c.id === categoryId)),
      };
      categoryRepository.db.prepare.mockReturnValue(mockStmt);

      const category = categoryRepository.findById(categoryId);

      expect(category).toBeDefined();
      expect(category.id).toBe(categoryId);
      expect(category.name).toBe('Favoritos');
    });
  });

  describe('edge cases and error handling', () => {
    test('should handle database errors in createCategory', () => {
      const mockStmt = {
        run: vi.fn(() => {
          throw new Error('UNIQUE constraint failed: categories.name');
        }),
      };
      categoryRepository.db.prepare.mockReturnValue(mockStmt);

      expect(() => {
        categoryRepository.createCategory({
          name: 'Favoritos', // Nombre duplicado
        });
      }).toThrow('UNIQUE constraint failed');
    });

    test('should handle invalid category queries gracefully', () => {
      const mockStmt = {
        all: vi.fn(() => {
          throw new Error('SQL error');
        }),
      };
      categoryRepository.db.prepare.mockReturnValue(mockStmt);

      expect(() => {
        categoryRepository.getCocktails('invalid_id');
      }).toThrow('SQL error');
    });
  });
});
