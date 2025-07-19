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
    if (!userId) {
      throw new Error('User ID is required');
    }

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
    if (!userId || !cocktailId) {
      throw new Error('User ID and Cocktail ID are required');
    }

    const favCategoryId = this.getFavoriteCategoryId();
    if (!favCategoryId) {
      return false;
    }

    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count 
      FROM cocktail_categories cc
      WHERE cc.id_category = ? 
        AND cc.id_cocktail = ?
    `);

    return stmt.get(favCategoryId, cocktailId).count > 0;
  }

  /**
   * Agregar a favoritos
   */
  addFavorite(userId, cocktailId) {
    if (!userId || !cocktailId) {
      throw new Error('User ID and Cocktail ID are required');
    }

    const favCategoryId = this.getFavoriteCategoryId();
    if (!favCategoryId) {
      return null;
    }

    // Verificar si ya es favorito
    const checkStmt = this.db.prepare(`
      SELECT COUNT(*) as count 
      FROM cocktail_categories cc
      WHERE cc.id_category = ? 
        AND cc.id_cocktail = ?
    `);

    if (checkStmt.get(favCategoryId, cocktailId).count > 0) {
      return null;
    }

    // Agregar a favoritos
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO cocktail_categories (id_cocktail, id_category)
      VALUES (?, ?)
    `);

    const result = stmt.run(cocktailId, favCategoryId);
    return result.lastInsertRowid;
  }

  /**
   * Remover de favoritos
   */
  /**
   * Remover de favoritos
   */
  removeFavorite(userId, cocktailId) {
    if (!userId || !cocktailId) {
      throw new Error('User ID and cocktail ID are required');
    }

    const favCategoryId = this.getFavoriteCategoryId();
    if (!favCategoryId) {
      return 0;
    }

    const stmt = this.db.prepare(`
      DELETE FROM cocktail_categories 
      WHERE id_cocktail = ? 
        AND id_category = ?
    `);

    const result = stmt.run(cocktailId, favCategoryId);
    return result.changes;
  }

  /**
   * Alternar favorito
   */
  toggleFavorite(userId, cocktailId) {
    if (!userId || !cocktailId) {
      throw new Error('User ID and Cocktail ID are required');
    }

    const favCategoryId = this.getFavoriteCategoryId();
    if (!favCategoryId) {
      return { added: false, removed: false };
    }

    // Check si ya es favorito
    const checkStmt = this.db.prepare(`
      SELECT COUNT(*) as count 
      FROM cocktail_categories cc
      WHERE cc.id_category = ? 
        AND cc.id_cocktail = ?
    `);

    const isCurrentlyFavorite = checkStmt.get(favCategoryId, cocktailId).count > 0;

    if (isCurrentlyFavorite) {
      // Remover de favoritos
      const deleteStmt = this.db.prepare(`
        DELETE FROM cocktail_categories 
        WHERE id_cocktail = ? 
          AND id_category = ?
      `);
      const result = deleteStmt.run(cocktailId, favCategoryId);
      return { added: false, removed: result.changes > 0 };
    } else {
      // Agregar a favoritos
      const insertStmt = this.db.prepare(`
        INSERT OR IGNORE INTO cocktail_categories (id_cocktail, id_category)
        VALUES (?, ?)
      `);
      const result = insertStmt.run(cocktailId, favCategoryId);
      return { added: result.lastInsertRowid !== undefined, removed: false };
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

  /**
   * Obtener estadísticas de favoritos del usuario
   */
  getUserFavoriteStats(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const favCategoryId = this.getFavoriteCategoryId();
    if (!favCategoryId) {
      return {
        total_favorites: 0,
        alcoholic_favorites: 0,
        non_alcoholic_favorites: 0,
        avg_alcohol_content: 0,
      };
    }

    const query = `
      SELECT 
        COUNT(*) as total_favorites,
        SUM(CASE WHEN c.is_alcoholic = 1 THEN 1 ELSE 0 END) as alcoholic_favorites,
        SUM(CASE WHEN c.is_alcoholic = 0 THEN 1 ELSE 0 END) as non_alcoholic_favorites,
        AVG(c.alcohol_content) as avg_alcohol_content
      FROM cocktail_categories cc
      JOIN cocktails c ON c.id = cc.id_cocktail
      WHERE cc.id_category = ? AND c.id_owner = ?
    `;

    return this.db.prepare(query).get(favCategoryId, userId);
  }

  /**
   * Obtener los cócteles más favoritados
   */
  getMostFavorited(limit = 10) {
    const favCategoryId = this.getFavoriteCategoryId();
    if (!favCategoryId) {
      return [];
    }

    const query = `
      SELECT 
        c.id,
        c.name AS nombre,
        c.img_url AS imagen,
        COUNT(cc.id_cocktail) as total_favorites
      FROM cocktails c
      JOIN cocktail_categories cc ON c.id = cc.id_cocktail
      WHERE cc.id_category = ?
      GROUP BY c.id, c.name, c.img_url
      ORDER BY total_favorites DESC
      LIMIT ?
    `;

    return this.db.prepare(query).all(favCategoryId, limit);
  }
}

export default FavoriteRepository;
