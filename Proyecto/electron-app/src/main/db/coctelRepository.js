import db from './database.js';

export default {
  // Crear un nuevo cóctel
  guardarCoctel: (coctel) => {
    const stmt = db.prepare(`
      INSERT INTO cocteles (
        nombre, descripcion, ingredientes, instrucciones,
        categoria, dificultad, tiempo_preparacion, imagen_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      coctel.nombre,
      coctel.descripcion || null,
      JSON.stringify(coctel.ingredientes),
      coctel.instrucciones,
      coctel.categoria || null,
      coctel.dificultad || null,
      coctel.tiempo_preparacion || null,
      coctel.imagen_url || null
    );

    return result.lastInsertRowid;
  },

  // Obtener todos los cócteles
  obtenerTodosCocteles: () => {
    const stmt = db.prepare('SELECT * FROM cocteles ORDER BY created_at DESC');
    const cocteles = stmt.all();

    // Parsear ingredientes de JSON
    return cocteles.map((coctel) => ({
      ...coctel,
      ingredientes: JSON.parse(coctel.ingredientes),
    }));
  },

  // Obtener cóctel por ID
  obtenerCoctelPorId: (id) => {
    const stmt = db.prepare('SELECT * FROM cocteles WHERE id = ?');
    const coctel = stmt.get(id);

    if (coctel) {
      coctel.ingredientes = JSON.parse(coctel.ingredientes);
    }

    return coctel;
  },

  // Buscar cócteles por nombre
  buscarCoctelesPorNombre: (nombre) => {
    const stmt = db.prepare('SELECT * FROM cocteles WHERE nombre LIKE ? ORDER BY nombre');
    const cocteles = stmt.all(`%${nombre}%`);

    return cocteles.map((coctel) => ({
      ...coctel,
      ingredientes: JSON.parse(coctel.ingredientes),
    }));
  },

  // Filtrar por categoría
  obtenerCoctelesPorCategoria: (categoria) => {
    const stmt = db.prepare('SELECT * FROM cocteles WHERE categoria = ? ORDER BY nombre');
    const cocteles = stmt.all(categoria);

    return cocteles.map((coctel) => ({
      ...coctel,
      ingredientes: JSON.parse(coctel.ingredientes),
    }));
  },

  // Actualizar cóctel
  actualizarCoctel: (id, coctel) => {
    const stmt = db.prepare(`
      UPDATE cocteles SET
        nombre = ?, descripcion = ?, ingredientes = ?, instrucciones = ?,
        categoria = ?, dificultad = ?, tiempo_preparacion = ?, imagen_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = stmt.run(
      coctel.nombre,
      coctel.descripcion || null,
      JSON.stringify(coctel.ingredientes),
      coctel.instrucciones,
      coctel.categoria || null,
      coctel.dificultad || null,
      coctel.tiempo_preparacion || null,
      coctel.imagen_url || null,
      id
    );

    return result.changes > 0;
  },

  // Eliminar cóctel
  eliminarCoctel: (id) => {
    const stmt = db.prepare('DELETE FROM cocteles WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // Obtener estadísticas
  obtenerEstadisticas: () => {
    const totalStmt = db.prepare('SELECT COUNT(*) as total FROM cocteles');
    const categoriaStmt = db.prepare(`
      SELECT categoria, COUNT(*) as count
      FROM cocteles
      WHERE categoria IS NOT NULL
      GROUP BY categoria
    `);

    return {
      total: totalStmt.get().total,
      porCategoria: categoriaStmt.all(),
    };
  },
};
