import { getDatabase } from '../config/database.js';

/**
 * Base Repository class con operaciones comunes
 */
class BaseRepository {
  constructor(tableName, primaryKey = 'id') {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
    this.db = getDatabase();
  }

  /**
   * Encontrar por ID
   */
  findById(id) {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`);
    return stmt.get(id);
  }

  /**
   * Encontrar todos
   */
  findAll() {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName}`);
    return stmt.all();
  }

  /**
   * Crear nuevo registro
   */
  create(data) {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(', ');
    const stmt = this.db.prepare(`
      INSERT INTO ${this.tableName} (${keys.join(', ')})
      VALUES (${placeholders})
    `);

    const result = stmt.run(...Object.values(data));
    return result.lastInsertRowid;
  }

  /**
   * Actualizar por ID
   */
  update(id, data) {
    const keys = Object.keys(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const stmt = this.db.prepare(`
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE ${this.primaryKey} = ?
    `);

    const result = stmt.run(...Object.values(data), id);
    return result.changes > 0;
  }

  /**
   * Eliminar por ID
   */
  delete(id) {
    const stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`);
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Contar registros
   */
  count() {
    const stmt = this.db.prepare(`SELECT COUNT(*) as total FROM ${this.tableName}`);
    return stmt.get().total;
  }
}

export default BaseRepository;
