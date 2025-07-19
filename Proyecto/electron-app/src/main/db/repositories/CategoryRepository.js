import BaseRepository from './BaseRepository.js';

class CategoryRepository extends BaseRepository {
  constructor() {
    super('categories', 'id');
  }

  /**
   * Buscar categoría por nombre
   */
  findByName(name) {
    const stmt = this.db.prepare('SELECT * FROM categories WHERE name = ?');
    return stmt.get(name);
  }

  /**
   * Obtener categorías del sistema
   */
  findSystemCategories() {
    const stmt = this.db.prepare('SELECT * FROM categories WHERE is_system = 1 ORDER BY name');
    return stmt.all();
  }

  /**
   * Obtener categorías de usuario
   */
  findUserCategories(userId = null) {
    let query = 'SELECT * FROM categories WHERE is_system = 0';
    const params = [];

    if (userId) {
      query += ' AND id_owner = ?';
      params.push(userId);
    }

    query += ' ORDER BY name';

    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Crear nueva categoría
   */
  createCategory(categoryData) {
    const stmt = this.db.prepare(`
      INSERT INTO categories (name, description, color, is_system, id_owner)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      categoryData.name,
      categoryData.description || null,
      categoryData.color || '#6B7280',
      categoryData.is_system || 0,
      categoryData.id_owner || null,
    );

    return result.lastInsertRowid;
  }

  /**
   * Obtener cócteles de una categoría
   */
  getCocktails(categoryId) {
    const query = `
      SELECT
        c.id,
        c.name AS nombre,
        c.img_url AS imagen,
        c.difficulty AS dificultad,
        c.description AS descripcion
      FROM cocktails c
      JOIN cocktail_categories cc ON c.id = cc.id_cocktail
      WHERE cc.id_category = ?
      ORDER BY c.name ASC
    `;

    return this.db.prepare(query).all(categoryId);
  }

  /**
   * Contar cócteles en una categoría
   */
  countCocktails(categoryId) {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count 
      FROM cocktail_categories 
      WHERE id_category = ?
    `);

    return stmt.get(categoryId).count;
  }

  /**
   * Métodos de compatibilidad
   */
  obtenerTodasCategorias() {
    return this.findAll();
  }

  findByUserId(userId) {
    return this.findUserCategories(userId);
  }
}

export default CategoryRepository;
