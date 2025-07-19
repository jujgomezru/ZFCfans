import { beforeEach, describe, expect, it, vi } from 'vitest';
import CocktailRepository from '../repositories/CocktailRepository.js';
import { createMockDatabase } from './mockData.js';

// Mock de la configuración de la base de datos (igual que en CocktailRepository.test.js)
vi.mock('../config/database.js', () => ({
  getDb: () => createMockDatabase(),
  getDatabase: () => createMockDatabase(),
  initDb: vi.fn(),
  closeDb: vi.fn(),
}));

describe('CocktailRepository – métodos para ResumenInformativo', () => {
  let repository;
  let mockDb;

  beforeEach(() => {
    mockDb = createMockDatabase();
    repository = new CocktailRepository();
    // Inyectamos la BD mock en el repo
    repository.db = mockDb;
  });

  describe('getDifficulty', () => {
    it('debería devolver la dificultad del cóctel por su ID', () => {
      // Preparamos el statement mock
      const mockStatement = {
        get: vi.fn(() => ({ difficulty: 'Medio' })),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      // Llamamos al método
      const result = repository.getDifficulty(42);

      // Verificamos que se usó la consulta SQL correcta con el ID
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT difficulty FROM cocktails WHERE id = ?',
        42,
      );
      // Y que devolvió el valor correcto
      expect(result).toBe('Medio');
    });
  });

  describe('getDuration', () => {
    it('debería sumar todas las duraciones de pasos y devolver el total', () => {
      // Simulamos tres pasos con duraciones
      const mockStatement = {
        all: vi.fn(() => [{ duration: 5 }, { duration: 3 }, { duration: 2 }]),
      };
      mockDb.prepare.mockReturnValue(mockStatement);

      // Llamamos al método
      const total = repository.getDuration(99);

      // Verificamos la consulta y el argumento
      expect(mockDb.prepare).toHaveBeenCalledWith(
        'SELECT duration FROM recipe_steps WHERE cocktail_id = ?',
        99,
      );
      // Y que sumó correctamente: 5 + 3 + 2 = 10
      expect(total).toBe(10);
    });
  });
});
