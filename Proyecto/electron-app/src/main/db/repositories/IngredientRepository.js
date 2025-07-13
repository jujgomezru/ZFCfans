import BaseRepository from './BaseRepository.js';

class IngredientRepository extends BaseRepository {
  constructor() {
    super('ingredients', 'ingredient_id');
  }

  /**
   * Buscar ingrediente por nombre
   */
  findByName(name) {
    const stmt = this.db.prepare('SELECT * FROM ingredients WHERE name = ?');
    return stmt.get(name);
  }

  /**
   * Crear nuevo ingrediente
   */
  createIngredient(ingredientData) {
    const stmt = this.db.prepare(`
      INSERT INTO ingredients (name, unit_type)
      VALUES (?, ?)
    `);

    const result = stmt.run(ingredientData.name, ingredientData.unit_type);

    return result.lastInsertRowid;
  }

  /**
   * Crear ingrediente si no existe
   */
  createIfNotExists(name, unitType = 'ml') {
    const existing = this.findByName(name);
    if (existing) {
      return existing.ingredient_id;
    }

    return this.createIngredient({ name, unit_type: unitType });
  }

  /**
   * Buscar ingredientes por patrón
   */
  searchByName(pattern) {
    const stmt = this.db.prepare('SELECT * FROM ingredients WHERE name LIKE ? ORDER BY name');
    return stmt.all(`%${pattern}%`);
  }
}

export default IngredientRepository;
