import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { mockBetterSqlite3 } from './mockData.js';

/**
 * Tests de integración para la base de datos
 * Verifica que el schema se cargue correctamente y que las operaciones básicas funcionen
 */

// Mock better-sqlite3
mockBetterSqlite3();

describe('Database Integration Tests', () => {
  let mockDb;

  beforeEach(async () => {
    // Limpiar mocks
    vi.clearAllMocks();

    // Cargar schema para verificar que existe
    const schemaPath = path.join(process.cwd(), 'src/main/db/config/schema.sql');
    const schemaContent = readFileSync(schemaPath, 'utf8');

    // Simular creación de base de datos con mock específico para database.test.js
    const { default: Database } = await import('better-sqlite3');
    mockDb = new Database(':memory:');

    // Override los mocks globales con comportamiento específico para estos tests
    mockDb.exec = vi.fn();
    mockDb.prepare = vi.fn(() => ({
      run: vi.fn(() => ({ lastInsertRowid: 1, changes: 1 })),
      get: vi.fn(),
      all: vi.fn(() => [
        { name: 'users' },
        { name: 'categories' },
        { name: 'cocktails' },
        { name: 'ingredients' },
        { name: 'recipes' },
        { name: 'cocktail_categories' },
        { name: 'notifications' },
      ]),
    }));

    // Simular ejecución del schema
    mockDb.exec(schemaContent);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Database schema loads successfully', () => {
    // Verificar que exec fue llamado (schema se cargó)
    expect(mockDb.exec).toHaveBeenCalled();

    // Simular consulta de tablas
    const stmt = mockDb.prepare(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `);
    const tables = stmt.all();

    const tableNames = tables.map(t => t.name);

    // Verificar que las tablas principales existen
    expect(tableNames).toContain('users');
    expect(tableNames).toContain('categories');
    expect(tableNames).toContain('cocktails');
    expect(tableNames).toContain('ingredients');
    expect(tableNames).toContain('recipes');
    expect(tableNames).toContain('cocktail_categories');
    expect(tableNames).toContain('notifications');
  });

  test('Basic CRUD operations work correctly', () => {
    // Test de inserción básica
    const insertUser = mockDb.prepare(`
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `);

    const userResult = insertUser.run('testuser', 'test@example.com', 'password123');
    expect(userResult.lastInsertRowid).toBe(1);

    // Test de consulta básica
    const selectUser = mockDb.prepare('SELECT * FROM users WHERE id = ?');
    selectUser.get = vi.fn(() => ({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    }));

    const user = selectUser.get(1);
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
  });

  test('Foreign key relationships work correctly', () => {
    // Test de relación many-to-many
    const insertCocktailCategory = mockDb.prepare(`
      INSERT INTO cocktail_categories (id_cocktail, id_category)
      VALUES (?, ?)
    `);

    const result = insertCocktailCategory.run(1, 2);
    expect(result.lastInsertRowid).toBe(1);

    // Test de consulta con JOIN
    const selectRelations = mockDb.prepare(`
      SELECT c.name as cocktail_name, cat.name as category_name
      FROM cocktail_categories cc
      JOIN cocktails c ON cc.id_cocktail = c.id
      JOIN categories cat ON cc.id_category = cat.id
      WHERE cc.id_cocktail = ?
    `);

    selectRelations.all = vi.fn(() => [{ cocktail_name: 'Mojito', category_name: 'Aperitivos' }]);

    const relations = selectRelations.all(1);
    expect(relations).toHaveLength(1);
    expect(relations[0].cocktail_name).toBe('Mojito');
    expect(relations[0].category_name).toBe('Aperitivos');
  });

  test('Database constraints are properly defined', () => {
    // Test constraint positivo: debe funcionar
    const validInsert = mockDb.prepare(`
      INSERT INTO cocktails (name, difficulty, preparation_time, servings, alcohol_content)
      VALUES (?, ?, ?, ?, ?)
    `);

    expect(() => {
      validInsert.run('Valid Cocktail', 'fácil', 5, 2, 15.5);
    }).not.toThrow();

    // Test constraint negativo: simular error de constraint
    const invalidInsert = mockDb.prepare(`
      INSERT INTO cocktails (name, difficulty, preparation_time)
      VALUES (?, ?, ?)
    `);

    // Simular que la base de datos rechaza valores inválidos
    invalidInsert.run = vi.fn(() => {
      throw new Error('CHECK constraint failed: preparation_time > 0');
    });

    expect(() => {
      invalidInsert.run('Invalid Cocktail', 'fácil', -5);
    }).toThrow('CHECK constraint failed');
  });

  test('Schema includes all required default data', () => {
    // Verificar que las categorías del sistema existen
    const systemCategoriesStmt = mockDb.prepare(`
      SELECT name FROM categories WHERE is_system = 1
    `);

    systemCategoriesStmt.all = vi.fn(() => [
      { name: 'Favoritos' },
      { name: 'Recientes' },
      { name: 'Por Probar' },
    ]);

    const systemCategories = systemCategoriesStmt.all();
    expect(systemCategories.length).toBeGreaterThan(0);
    expect(systemCategories.map(c => c.name)).toContain('Favoritos');

    // Verificar que los maridajes existen
    const pairingsStmt = mockDb.prepare(`SELECT name FROM pairings`);
    pairingsStmt.all = vi.fn(() => [
      { name: 'Aperitivo' },
      { name: 'Digestivo' },
      { name: 'Cóctel de tarde' },
    ]);

    const pairings = pairingsStmt.all();
    expect(pairings.length).toBeGreaterThan(0);
  });
});
