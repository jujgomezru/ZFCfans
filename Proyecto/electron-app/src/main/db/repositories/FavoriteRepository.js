import BaseRepository from './BaseRepository.js';

class FavoriteRepository extends BaseRepository {
  constructor() {
    super('cocktail_categories', 'id_cocktail'); // Usamos cocktail_categories ahora
  }

  /**
   * Obtener ID de la categoría "Favoritos"
   */
  getFavoriteCategoryId() {
    const stmt = this.db.prepare(`
      SELECT id FROM categories 
      WHERE name = 'Favoritos' AND is_system = 1
    `);
    const result = stmt.get();
    return result ? result.id : null;
  }

  /**
   * Obtener favoritos de un usuario
   */
  findByUserId(userId) {
    const favCategoryId = this.getFavoriteCategoryId();
    if (!favCategoryId) {
      return [];
    }

    const query = `
      SELECT
        c.id,
        c.name AS nombre,
        c.img_url AS imagen,
        c.difficulty AS dificultad,
        c.description AS descripcion,
        cc.added_at AS marcado_en
      FROM cocktail_categories cc
      JOIN cocktails c ON c.id = cc.id_cocktail
      WHERE cc.id_category = ?
        AND c.id_owner = ?
      ORDER BY cc.added_at DESC
    `;

    return this.db.prepare(query).all(favCategoryId, userId);
  }

  /**
   * Verificar si un cóctel es favorito para un usuario
   */
  isFavorite(userId, cocktailId) {
    const favCategoryId = this.getFavoriteCategoryId();
    if (!favCategoryId) {
      return false;
    }

    // Verificar que el cóctel pertenezca al usuario y esté en favoritos
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count 
      FROM cocktail_categories cc
      JOIN cocktails c ON c.id = cc.id_cocktail
      WHERE cc.id_category = ? 
        AND cc.id_cocktail = ? 
        AND c.id_owner = ?
    `);

    return stmt.get(favCategoryId, cocktailId, userId).count > 0;
  }

  /**
   * Agregar a favoritos
   */
  addFavorite(userId, cocktailId) {
    const favCategoryId = this.getFavoriteCategoryId();
    if (!favCategoryId) {
      throw new Error('Categoría de favoritos no encontrada');
    }

    // Verificar que el cóctel pertenezca al usuario
    const cocktailStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM cocktails 
      WHERE id = ? AND id_owner = ?
    `);

    if (cocktailStmt.get(cocktailId, userId).count === 0) {
      throw new Error('Cóctel no encontrado o no pertenece al usuario');
    }

    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO cocktail_categories (id_cocktail, id_category)
      VALUES (?, ?)
    `);

    const result = stmt.run(cocktailId, favCategoryId);
    return result.changes > 0;
  }

  /**
   * Remover de favoritos
   */
  removeFavorite(userId, cocktailId) {
    const favCategoryId = this.getFavoriteCategoryId();
    if (!favCategoryId) {
      return false;
    }

    const stmt = this.db.prepare(`
      DELETE FROM cocktail_categories 
      WHERE id_cocktail = ? 
        AND id_category = ?
        AND id_cocktail IN (
          SELECT id FROM cocktails WHERE id_owner = ?
        )
    `);

    const result = stmt.run(cocktailId, favCategoryId, userId);
    return result.changes > 0;
  }

  /**
   * Alternar favorito
   */
  toggleFavorite(userId, cocktailId) {
    if (this.isFavorite(userId, cocktailId)) {
      return { action: 'removed', success: this.removeFavorite(userId, cocktailId) };
    } else {
      return { action: 'added', success: this.addFavorite(userId, cocktailId) };
    }
  }

  /**
   * Obtener todos los favoritos (sin filtro de usuario para admin)
   */
  findAllFavorites() {
    const favCategoryId = this.getFavoriteCategoryId();
    if (!favCategoryId) {
      return [];
    }

    const query = `
      SELECT
        c.id,
        c.name AS nombre,
        c.img_url AS imagen,
        u.username AS propietario,
        cc.added_at AS marcado_en
      FROM cocktail_categories cc
      JOIN cocktails c ON c.id = cc.id_cocktail
      JOIN users u ON u.id = c.id_owner
      WHERE cc.id_category = ?
      ORDER BY cc.added_at DESC
    `;

    return this.db.prepare(query).all(favCategoryId);
  }

  /**
   * Contar favoritos de un usuario
   */
  countByUserId(userId) {
    const favCategoryId = this.getFavoriteCategoryId();
    if (!favCategoryId) {
      return 0;
    }

    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count 
      FROM cocktail_categories cc
      JOIN cocktails c ON c.id = cc.id_cocktail
      WHERE cc.id_category = ? AND c.id_owner = ?
    `);

    return stmt.get(favCategoryId, userId).count;
  }
}

export default FavoriteRepository;
