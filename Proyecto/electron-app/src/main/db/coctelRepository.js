import db from './database.js';

export default {
  // Crear un nuevo cóctel
    guardarCoctel: coctel => {
    const stmt = db.prepare(`
      INSERT INTO cocktails (
        name, description, difficulty, glass_type, is_alcoholic, creator_user_id
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      coctel.nombre,
      coctel.descripcion || null,
      coctel.dificultad || 1,
      coctel.vaso || null,
      coctel.is_alcoholic ? 1 : 0,
      coctel.user_id,
    );

    return result.lastInsertRowid;
  },

  // Obtener todos los cócteles
    obtenerTodosCocteles: () => {
    const rows = db.prepare(`
      SELECT
        c.cocktail_id AS id,
        c.name AS nombre,
        COALESCE(cat.name, '') AS categoria,
        img.url AS imagen
      FROM cocktails c
      LEFT JOIN cocktail_categories cc ON cc.cocktail_id = c.cocktail_id
      LEFT JOIN categories cat ON cat.category_id = cc.category_id
      LEFT JOIN (
        SELECT cocktail_id, MIN(image_id) AS min_img_id
        FROM cocktail_images
        GROUP BY cocktail_id
      ) ci ON ci.cocktail_id = c.cocktail_id
      LEFT JOIN cocktail_images img ON img.image_id = ci.min_img_id
      ORDER BY c.created_at DESC
    `).all();
    return rows;
  },
  // Obtener cóctel por ID
    obtenerCoctelPorId: id => {
    const stmt = db.prepare(`
      SELECT
        c.cocktail_id AS id,
        c.name AS nombre,
        c.description,
        c.difficulty,
        c.glass_type,
        c.is_alcoholic,
        c.creator_user_id,
        c.created_at
      FROM cocktails c
      WHERE c.cocktail_id = ?
    `);

    const coctel = stmt.get(id);
    if (!coctel) {return null;}

    // Ingredientes
    const ingredientes = db.prepare(`
      SELECT i.name, ci.quantity, i.unit_type
      FROM cocktail_ingredients ci
      JOIN ingredients i ON i.ingredient_id = ci.ingredient_id
      WHERE ci.cocktail_id = ?
    `).all(id);

    // Pasos
    const pasos = db.prepare(`
      SELECT step_number, instruction
      FROM cocktail_steps
      WHERE cocktail_id = ?
      ORDER BY step_number ASC
    `).all(id);

    // Imágenes
    const imagenes = db.prepare(`
      SELECT url
      FROM cocktail_images
      WHERE cocktail_id = ?
      ORDER BY uploaded_at ASC
    `).all(id);

    // Categorías
    const categorias = db.prepare(`
      SELECT cat.name
      FROM cocktail_categories cc
      JOIN categories cat ON cat.category_id = cc.category_id
      WHERE cc.cocktail_id = ?
    `).all(id).map(row => row.name);

    return {
      ...coctel,
      ingredientes,
      pasos,
      imagenes,
      categorias,
    };
  },


  // Buscar cócteles por nombre
    buscarCoctelesPorNombre: nombre => {
    const stmt = db.prepare(`
      SELECT
        c.cocktail_id AS id,
        c.name AS nombre,
        COALESCE(cat.name, '') AS categoria,
        img.url AS imagen
      FROM cocktails c
      LEFT JOIN cocktail_categories cc ON cc.cocktail_id = c.cocktail_id
      LEFT JOIN categories cat ON cat.category_id = cc.category_id
      LEFT JOIN (
        SELECT cocktail_id, MIN(image_id) AS min_img_id
        FROM cocktail_images
        GROUP BY cocktail_id
      ) ci ON ci.cocktail_id = c.cocktail_id
      LEFT JOIN cocktail_images img ON img.image_id = ci.min_img_id
      WHERE c.name LIKE ?
      ORDER BY c.name ASC
    `);

    return stmt.all(`%${nombre}%`);
  },


  // Filtrar por categoría
    obtenerCoctelesPorCategoria: categoria => {
    const stmt = db.prepare(`
      SELECT
        c.cocktail_id AS id,
        c.name AS nombre,
        COALESCE(cat.name, '') AS categoria,
        img.url AS imagen
      FROM cocktails c
      JOIN cocktail_categories cc ON cc.cocktail_id = c.cocktail_id
      JOIN categories cat ON cat.category_id = cc.category_id
      LEFT JOIN (
        SELECT cocktail_id, MIN(image_id) AS min_img_id
        FROM cocktail_images
        GROUP BY cocktail_id
      ) ci ON ci.cocktail_id = c.cocktail_id
      LEFT JOIN cocktail_images img ON img.image_id = ci.min_img_id
      WHERE cat.name = ?
      ORDER BY c.name ASC
    `);

    return stmt.all(categoria);
  },


  // Actualizar cóctel
  actualizarCoctel: (id, coctel) => {
    const stmt = db.prepare(`
      UPDATE cocktails SET
        name = ?, description = ?, difficulty = ?, glass_type = ?,
        is_alcoholic = ?, creator_user_id = ?
      WHERE cocktail_id = ?
    `);

    const result = stmt.run(
      coctel.nombre,
      coctel.descripcion || null,
      coctel.dificultad || 1,
      coctel.vaso || null,
      coctel.is_alcoholic ? 1 : 0,
      coctel.user_id,
      id,
    );

    return result.changes > 0;
  },


  // Eliminar cóctel
    eliminarCoctel: id => {
    const stmt = db.prepare('DELETE FROM cocktails WHERE cocktail_id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },


  // Obtener estadísticas
    obtenerEstadisticas: () => {
    const totalStmt = db.prepare('SELECT COUNT(*) as total FROM cocktails');

    const categoriaStmt = db.prepare(`
      SELECT cat.name AS categoria, COUNT(*) as count
      FROM cocktail_categories cc
      JOIN categories cat ON cat.category_id = cc.category_id
      GROUP BY cat.name
    `);

    return {
      total: totalStmt.get().total,
      porCategoria: categoriaStmt.all(),
    };
  },
};
