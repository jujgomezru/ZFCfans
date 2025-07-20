import { beforeEach, describe, expect, it, vi } from 'vitest';

// 1. Mockea 'better-sqlite3' ANTES de cualquier import del repo
vi.mock('better-sqlite3', () => ({
  default: vi.fn(() => ({})),
}));

// 2. Mockea el módulo de la base de datos
vi.mock('../config/database.js', () => ({
  getDb: vi.fn(),
  getDatabase: vi.fn(),
  initDb: vi.fn(),
  closeDb: vi.fn(),
}));

import CocktailRepository from '../repositories/CocktailRepository.js';

// 3. Mock simple de la base de datos, sin recursividad
function makeSimpleMockDb(pasosArr, cocktailId) {
  let queryCount = 0;
  return {
    prepare: vi.fn(query => {
      // 1ra llamada: query del cocktail principal (devuelve objeto cóctel)
      if (queryCount === 0) {
        queryCount++;
        return {
          get: vi.fn(() => ({ id: cocktailId, name: `Cóctel ${cocktailId}` })),
          all: vi.fn(),
        };
      }
      // ingredientes: no interesa
      if (query.toLowerCase().includes('from recipe_ingredients')) {
        return { all: vi.fn(() => []) };
      }
      // pasos
      if (query.toLowerCase().includes('from recipe_steps')) {
        return { all: vi.fn(() => pasosArr) };
      }
      // fallback
      return { all: vi.fn(() => []) };
    }),
  };
}

describe('CocktailRepository – pasos/instrucciones (64 runs)', () => {
  const RUNS = 64;

  for (let i = 1; i <= RUNS; i++) {
    describe(`Caso #${i}`, () => {
      let repository;
      let mockDb;
      // Cada cóctel tiene 3 pasos
      const pasos = [
        { numero: 1, instruccion: `Paso 1 cóctel ${i}`, duracion: 1, es_critico: 1 },
        { numero: 2, instruccion: `Paso 2 cóctel ${i}`, duracion: 2, es_critico: 0 },
        { numero: 3, instruccion: `Paso 3 cóctel ${i}`, duracion: 3, es_critico: 0 },
      ];

      beforeEach(() => {
        mockDb = makeSimpleMockDb(pasos, i);
        repository = new CocktailRepository();
        repository.db = mockDb;
      });

      it(`debería retornar los pasos correctos y ordenados para el cóctel #${i}`, () => {
        const cocktail = repository.findCompleteById(i);

        expect(Array.isArray(cocktail.pasos)).toBe(true);
        expect(cocktail.pasos).toHaveLength(3);
        expect(cocktail.pasos).toEqual(pasos);
        expect(cocktail.pasos[0].numero).toBe(1);
        expect(cocktail.pasos[1].numero).toBe(2);
        expect(cocktail.pasos[2].numero).toBe(3);
      });
    });
  }
});
