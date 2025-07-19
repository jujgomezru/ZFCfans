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

  const RUNS = 32;
  for (let run = 1; run <= RUNS; run++) {
    describe(`Iteración #${run}`, () => {
      describe('getDifficulty', () => {
        it('debería devolver la dificultad del cóctel por su ID', () => {
          const mockStatement = { get: vi.fn(() => ({ difficulty: 'Medio' })) };
          mockDb.prepare.mockReturnValue(mockStatement);

          const result = repository.getDifficulty(42);

          expect(mockDb.prepare).toHaveBeenCalledWith(
            'SELECT difficulty FROM cocktails WHERE id = ?',
          );
          expect(mockStatement.get).toHaveBeenCalledWith(42);
          expect(result).toBe('Medio');
        });
      });

      describe('getTotalDuration', () => {
        it('debería devolver el total de duración usando SUM en SQL', () => {
          const mockStatement = { get: vi.fn(() => ({ total_duration: 10 })) };
          mockDb.prepare.mockReturnValue(mockStatement);

          const total = repository.getTotalDuration(99);

          expect(mockDb.prepare).toHaveBeenCalledWith(
            expect.stringContaining('SELECT SUM(rs.duration) AS total_duration'),
          );
          expect(mockStatement.get).toHaveBeenCalledWith(99);
          expect(total).toBe(10);
        });
      });
    });
  }

  //   describe('getDifficulty', () => {
  //     it('debería devolver la dificultad del cóctel por su ID', () => {
  //       // Preparamos el statement mock
  //       const mockStatement = {
  //         get: vi.fn(() => ({ difficulty: 'Medio' })),
  //       };
  //       mockDb.prepare.mockReturnValue(mockStatement);

  //       // Llamamos al método
  //       const result = repository.getDifficulty(42);

  //       // Verificamos que se usó la consulta SQL correcta con el ID
  //       expect(mockDb.prepare).toHaveBeenCalledWith('SELECT difficulty FROM cocktails WHERE id = ?');
  //       expect(mockStatement.get).toHaveBeenCalledWith(42);
  //       // Y que devolvió el valor correcto
  //       expect(result).toBe('Medio');
  //     });
  //   });

  //   describe('getTotalDuration', () => {
  //     it('debería devolver el total de duración usando SUM en SQL', () => {
  //       // Stub: el statement devuelve un objeto con total_duration
  //       const mockStatement = {
  //         get: vi.fn(() => ({ total_duration: 5 + 3 + 2 })),
  //       };
  //       mockDb.prepare.mockReturnValue(mockStatement);

  //       // Llamamos al método correcto
  //       const total = repository.getTotalDuration(99);

  //       // 1) El SQL debe usar SUM(...) AS total_duration
  //       expect(mockDb.prepare).toHaveBeenCalledWith(
  //         expect.stringContaining('SELECT SUM(rs.duration) AS total_duration'),
  //       );
  //       // 2) El parámetro pasa por get()
  //       expect(mockStatement.get).toHaveBeenCalledWith(99);
  //       // 3) El método devuelve el valor total
  //       expect(total).toBe(10);
  //     });
  //   });
  // });
});
