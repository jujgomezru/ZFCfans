import BaseRepository from './BaseRepository.js';

class IngredientRepository extends BaseRepository {
  constructor() {
    super('ingredients', 'id');
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
      INSERT INTO ingredients (name, description, unit_type, alcohol_content)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      ingredientData.name,
      ingredientData.description,
      ingredientData.unit_type,
      ingredientData.alcohol_content,
    );

    return result.lastInsertRowid;
  }

  /**
   * Crear ingrediente si no existe
   */
  createIfNotExists(name, unitType = 'ml') {
    const existing = this.findByName(name);
    if (existing) {
      return existing.id;
    }

    return this.createIngredient({ name, unit_type: unitType });
  }

  /**
   * Buscar ingredientes por patrón
   */
  searchByName(pattern) {
    const stmt = this.db.prepare('SELECT * FROM ingredients WHERE name LIKE ? ORDER BY name');
    return stmt.all(pattern);
  }

  /**
   * Obtener ingredientes alcohólicos
   */
  getAlcoholicIngredients() {
    const stmt = this.db.prepare(
      'SELECT * FROM ingredients WHERE alcohol_content > 0 ORDER BY name',
    );
    return stmt.all();
  }

  /**
   * Obtener ingredientes no alcohólicos
   */
  getNonAlcoholicIngredients() {
    const stmt = this.db.prepare(
      'SELECT * FROM ingredients WHERE alcohol_content = 0 ORDER BY name',
    );
    return stmt.all();
  }
}

export default IngredientRepository;
