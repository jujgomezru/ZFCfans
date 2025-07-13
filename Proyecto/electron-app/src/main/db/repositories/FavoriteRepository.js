import BaseRepository from './BaseRepository.js';

class FavoriteRepository extends BaseRepository {
  constructor() {
    super('favorites');
  }

  /**
   * Obtener favoritos de un usuario
   */
  findByUserId(userId) {
    const query = `
      SELECT
        c.cocktail_id AS id,
        c.name AS nombre,
        COALESCE(cat.name, '') AS categoria,
        img.url AS imagen,
        f.marked_at
      FROM favorites f
      JOIN cocktails c ON c.cocktail_id = f.cocktail_id
      LEFT JOIN cocktail_categories cc ON cc.cocktail_id = c.cocktail_id
      LEFT JOIN categories cat ON cat.category_id = cc.category_id
      LEFT JOIN (
        SELECT cocktail_id, MIN(image_id) AS min_img_id
        FROM cocktail_images
        GROUP BY cocktail_id
      ) ci ON ci.cocktail_id = c.cocktail_id
      LEFT JOIN cocktail_images img ON img.image_id = ci.min_img_id
      WHERE f.user_id = ?
      ORDER BY f.marked_at DESC
    `;

    return this.db.prepare(query).all(userId);
  }

  /**
   * Verificar si un cóctel es favorito
   */
  isFavorite(userId, cocktailId) {
    const stmt = this.db.prepare(
      'SELECT COUNT(*) as count FROM favorites WHERE user_id = ? AND cocktail_id = ?',
    );
    return stmt.get(userId, cocktailId).count > 0;
  }

  /**
   * Agregar a favoritos
   */
  addFavorite(userId, cocktailId) {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO favorites (user_id, cocktail_id)
      VALUES (?, ?)
    `);

    const result = stmt.run(userId, cocktailId);
    return result.changes > 0;
  }

  /**
   * Remover de favoritos
   */
  removeFavorite(userId, cocktailId) {
    const stmt = this.db.prepare('DELETE FROM favorites WHERE user_id = ? AND cocktail_id = ?');
    const result = stmt.run(userId, cocktailId);
    return result.changes > 0;
  }

  /**
   * Alternar favorito
   */
  toggleFavorite(userId, cocktailId) {
    if (this.isFavorite(userId, cocktailId)) {
      return this.removeFavorite(userId, cocktailId);
    } else {
      return this.addFavorite(userId, cocktailId);
    }
  }
}

export default FavoriteRepository;
