import BaseRepository from './BaseRepository.js';

class CategoryRepository extends BaseRepository {
  constructor() {
    super('categories', 'category_id');
  }

  /**
   * Obtener categorías por usuario
   */
  findByUserId(userId) {
    const stmt = this.db.prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY name');
    return stmt.all(userId);
  }

  /**
   * Buscar categoría por nombre y usuario
   */
  findByNameAndUser(name, userId) {
    const stmt = this.db.prepare('SELECT * FROM categories WHERE name = ? AND user_id = ?');
    return stmt.get(name, userId);
  }

  /**
   * Crear nueva categoría
   */
  createCategory(categoryData) {
    const stmt = this.db.prepare(`
      INSERT INTO categories (user_id, name, description)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(
      categoryData.user_id,
      categoryData.name,
      categoryData.description || null,
    );

    return result.lastInsertRowid;
  }

  /**
   * Crear categoría si no existe
   */
  createIfNotExists(name, userId) {
    const existing = this.findByNameAndUser(name, userId);
    if (existing) {
      return existing.category_id;
    }

    return this.createCategory({ name, user_id: userId });
  }
}

export default CategoryRepository;
