import { beforeEach, describe, expect, it, vi } from 'vitest';
import FavoriteRepository from '../repositories/FavoriteRepository.js';
import { createMockDatabase, mockCocktails } from './mockData.js';

// Mock del database
vi.mock('../config/database.js', () => ({
  getDb: () => createMockDatabase(),
  getDatabase: () => createMockDatabase(),
  initDb: vi.fn(),
  closeDb: vi.fn(),
}));

describe('FavoriteRepository', () => {
  let repository;
  let mockDb;

  beforeEach(() => {
    mockDb = createMockDatabase();
    repository = new FavoriteRepository();
    repository.db = mockDb;
  });

  describe('getFavoriteCategoryId', () => {
    it('debería obtener el ID de la categoría Favoritos', () => {
      const mockStatement = {
        get: vi.fn(() => ({ id: 1 })),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.getFavoriteCategoryId();
      expect(result).toBe(1);
      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining("WHERE name = 'Favoritos' AND is_system = 1"),
      );
    });

    it('debería retornar null si no existe la categoría Favoritos', () => {
      const mockStatement = {
        get: vi.fn(() => null),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.getFavoriteCategoryId();
      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('debería obtener los favoritos de un usuario', () => {
      // Mock para getFavoriteCategoryId
      const mockCategoryStatement = {
        get: vi.fn(() => ({ id: 1 })),
      };

      // Mock para la consulta de favoritos
      const mockFavoritesStatement = {
        all: vi.fn(() => [
          {
            id: 1,
            nombre: 'Mojito Clásico',
            imagen: 'https://example.com/mojito.jpg',
            dificultad: 'fácil',
            descripcion: 'El clásico cóctel cubano con menta y lima',
            marcado_en: '2025-01-01 12:30:00',
          },
        ]),
      };

      mockDb.prepare
        .mockReturnValueOnce(mockCategoryStatement)
        .mockReturnValueOnce(mockFavoritesStatement);

      const result = repository.findByUserId(1);
      expect(result).toHaveLength(1);
      expect(result[0].nombre).toBe('Mojito Clásico');
      expect(mockFavoritesStatement.all).toHaveBeenCalledWith(1, 1);
    });

    it('debería retornar array vacío si no existe categoría Favoritos', () => {
      const mockStatement = {
        get: vi.fn(() => null),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.findByUserId(1);
      expect(result).toEqual([]);
    });

    it('debería retornar array vacío para usuario sin favoritos', () => {
      const mockCategoryStatement = {
        get: vi.fn(() => ({ id: 1 })),
      };
      const mockFavoritesStatement = {
        all: vi.fn(() => []),
      };

      mockDb.prepare
        .mockReturnValueOnce(mockCategoryStatement)
        .mockReturnValueOnce(mockFavoritesStatement);

      const result = repository.findByUserId(999);
      expect(result).toEqual([]);
    });
  });

  describe('isFavorite', () => {
    it('debería verificar si un cóctel es favorito', () => {
      const mockCategoryStatement = {
        get: vi.fn(() => ({ id: 1 })),
      };
      const mockCheckStatement = {
        get: vi.fn(() => ({ count: 1 })),
      };

      mockDb.prepare
        .mockReturnValueOnce(mockCategoryStatement)
        .mockReturnValueOnce(mockCheckStatement);

      const result = repository.isFavorite(1, 1);
      expect(result).toBe(true);
      expect(mockCheckStatement.get).toHaveBeenCalledWith(1, 1);
    });

    it('debería retornar false si el cóctel no es favorito', () => {
      const mockCategoryStatement = {
        get: vi.fn(() => ({ id: 1 })),
      };
      const mockCheckStatement = {
        get: vi.fn(() => ({ count: 0 })),
      };

      mockDb.prepare
        .mockReturnValueOnce(mockCategoryStatement)
        .mockReturnValueOnce(mockCheckStatement);

      const result = repository.isFavorite(1, 2);
      expect(result).toBe(false);
    });

    it('debería retornar false si no existe categoría Favoritos', () => {
      const mockStatement = {
        get: vi.fn(() => null),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.isFavorite(1, 1);
      expect(result).toBe(false);
    });
  });

  describe('addFavorite', () => {
    it('debería agregar un cóctel a favoritos', () => {
      const mockCategoryStatement = {
        get: vi.fn(() => ({ id: 1 })),
      };
      const mockCheckStatement = {
        get: vi.fn(() => ({ count: 0 })),
      };
      const mockInsertStatement = {
        run: vi.fn(() => ({ lastInsertRowid: 5, changes: 1 })),
      };

      mockDb.prepare
        .mockReturnValueOnce(mockCategoryStatement)
        .mockReturnValueOnce(mockCheckStatement)
        .mockReturnValueOnce(mockInsertStatement);

      const result = repository.addFavorite(1, 2);
      expect(result).toBe(5);
      expect(mockInsertStatement.run).toHaveBeenCalledWith(2, 1);
    });

    it('debería retornar null si el cóctel ya es favorito', () => {
      const mockCategoryStatement = {
        get: vi.fn(() => ({ id: 1 })),
      };
      const mockCheckStatement = {
        get: vi.fn(() => ({ count: 1 })),
      };

      mockDb.prepare
        .mockReturnValueOnce(mockCategoryStatement)
        .mockReturnValueOnce(mockCheckStatement);

      const result = repository.addFavorite(1, 1);
      expect(result).toBeNull();
    });

    it('debería retornar null si no existe categoría Favoritos', () => {
      const mockStatement = {
        get: vi.fn(() => null),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.addFavorite(1, 1);
      expect(result).toBeNull();
    });
  });

  describe('removeFavorite', () => {
    it('debería remover un cóctel de favoritos', () => {
      const mockCategoryStatement = {
        get: vi.fn(() => ({ id: 1 })),
      };
      const mockDeleteStatement = {
        run: vi.fn(() => ({ changes: 1 })),
      };

      mockDb.prepare
        .mockReturnValueOnce(mockCategoryStatement)
        .mockReturnValueOnce(mockDeleteStatement);

      const result = repository.removeFavorite(1, 1);
      expect(result).toBe(1);
      expect(mockDeleteStatement.run).toHaveBeenCalledWith(1, 1);
    });

    it('debería retornar 0 si no existe la relación', () => {
      const mockCategoryStatement = {
        get: vi.fn(() => ({ id: 1 })),
      };
      const mockDeleteStatement = {
        run: vi.fn(() => ({ changes: 0 })),
      };

      mockDb.prepare
        .mockReturnValueOnce(mockCategoryStatement)
        .mockReturnValueOnce(mockDeleteStatement);

      const result = repository.removeFavorite(1, 999);
      expect(result).toBe(0);
    });

    it('debería retornar 0 si no existe categoría Favoritos', () => {
      const mockStatement = {
        get: vi.fn(() => null),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.removeFavorite(1, 1);
      expect(result).toBe(0);
    });
  });

  describe('toggleFavorite', () => {
    it('debería agregar a favoritos si no está marcado', () => {
      const mockCategoryStatement = {
        get: vi.fn(() => ({ id: 1 })),
      };
      const mockCheckStatement = {
        get: vi.fn(() => ({ count: 0 })),
      };
      const mockInsertStatement = {
        run: vi.fn(() => ({ lastInsertRowid: 5, changes: 1 })),
      };

      mockDb.prepare
        .mockReturnValueOnce(mockCategoryStatement)
        .mockReturnValueOnce(mockCheckStatement)
        .mockReturnValueOnce(mockInsertStatement);

      const result = repository.toggleFavorite(1, 2);
      expect(result).toEqual({ added: true, removed: false });
    });

    it('debería remover de favoritos si ya está marcado', () => {
      const mockCategoryStatement = {
        get: vi.fn(() => ({ id: 1 })),
      };
      const mockCheckStatement = {
        get: vi.fn(() => ({ count: 1 })),
      };
      const mockDeleteStatement = {
        run: vi.fn(() => ({ changes: 1 })),
      };

      mockDb.prepare
        .mockReturnValueOnce(mockCategoryStatement)
        .mockReturnValueOnce(mockCheckStatement)
        .mockReturnValueOnce(mockDeleteStatement);

      const result = repository.toggleFavorite(1, 1);
      expect(result).toEqual({ added: false, removed: true });
    });
  });

  describe('getUserFavoriteStats', () => {
    it('debería obtener estadísticas de favoritos del usuario', () => {
      const mockCategoryStatement = {
        get: vi.fn(() => ({ id: 1 })),
      };
      const mockStatsStatement = {
        get: vi.fn(() => ({
          total_favorites: 5,
          alcoholic_favorites: 3,
          non_alcoholic_favorites: 2,
          avg_alcohol_content: 15.2,
        })),
      };

      mockDb.prepare
        .mockReturnValueOnce(mockCategoryStatement)
        .mockReturnValueOnce(mockStatsStatement);

      const result = repository.getUserFavoriteStats(1);
      expect(result).toBeDefined();
      expect(result.total_favorites).toBe(5);
      expect(result.alcoholic_favorites).toBe(3);
      expect(result.non_alcoholic_favorites).toBe(2);
    });

    it('debería retornar stats por defecto si no hay categoría Favoritos', () => {
      const mockStatement = {
        get: vi.fn(() => null),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      const result = repository.getUserFavoriteStats(1);
      expect(result).toEqual({
        total_favorites: 0,
        alcoholic_favorites: 0,
        non_alcoholic_favorites: 0,
        avg_alcohol_content: 0,
      });
    });
  });

  describe('getMostFavorited', () => {
    it('debería obtener los cócteles más favoriteados', () => {
      const mockCategoryStatement = {
        get: vi.fn(() => ({ id: 1 })),
      };
      const mockTopStatement = {
        all: vi.fn(() => [
          {
            id: 1,
            nombre: 'Mojito Clásico',
            imagen: 'https://example.com/mojito.jpg',
            total_favorites: 10,
          },
          {
            id: 2,
            nombre: 'Moscow Mule',
            imagen: 'https://example.com/moscow_mule.jpg',
            total_favorites: 8,
          },
        ]),
      };

      mockDb.prepare
        .mockReturnValueOnce(mockCategoryStatement)
        .mockReturnValueOnce(mockTopStatement);

      const result = repository.getMostFavorited(5);
      expect(result).toHaveLength(2);
      expect(result[0].total_favorites).toBe(10);
      expect(result[1].total_favorites).toBe(8);
      expect(mockTopStatement.all).toHaveBeenCalledWith(1, 5);
    });

    it('debería usar límite por defecto', () => {
      const mockCategoryStatement = {
        get: vi.fn(() => ({ id: 1 })),
      };
      const mockTopStatement = {
        all: vi.fn(() => []),
      };

      mockDb.prepare
        .mockReturnValueOnce(mockCategoryStatement)
        .mockReturnValueOnce(mockTopStatement);

      repository.getMostFavorited();
      expect(mockTopStatement.all).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('Manejo de errores', () => {
    it('debería manejar errores de base de datos', () => {
      mockDb.prepare.mockImplementation(() => {
        throw new Error('Database error');
      });

      expect(() => repository.getFavoriteCategoryId()).toThrow('Database error');
    });

    it('debería validar parámetros requeridos', () => {
      expect(() => repository.findByUserId()).toThrow();
      expect(() => repository.isFavorite()).toThrow();
      expect(() => repository.addFavorite()).toThrow();
    });
  });

  describe('Integración con otros repositorios', () => {
    it('debería trabajar correctamente con datos de cócteles', () => {
      const mockCategoryStatement = {
        get: vi.fn(() => ({ id: 1 })),
      };
      const mockFavoritesStatement = {
        all: vi.fn(() =>
          mockCocktails.map(c => ({
            id: c.id,
            nombre: c.name,
            imagen: c.img_url,
            dificultad: c.difficulty,
            descripcion: c.description,
            marcado_en: '2025-01-01 12:30:00',
          })),
        ),
      };

      mockDb.prepare
        .mockReturnValueOnce(mockCategoryStatement)
        .mockReturnValueOnce(mockFavoritesStatement);

      const result = repository.findByUserId(1);
      expect(result).toHaveLength(mockCocktails.length);
    });
  });
});
