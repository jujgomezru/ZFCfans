export function initializeSchema(db) {
  db.pragma('foreign_keys = ON');

  // Usuarios
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
  ).run();

  // Cócteles
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS cocktails (
      cocktail_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
      glass_type TEXT,
      is_alcoholic INTEGER NOT NULL DEFAULT 1,
      creator_user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `,
  ).run();

  // Ingredientes
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS ingredients (
      ingredient_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      unit_type TEXT NOT NULL
    )
  `,
  ).run();

  // Ingredientes de cócteles
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS cocktail_ingredients (
      cocktail_id INTEGER NOT NULL,
      ingredient_id INTEGER NOT NULL,
      quantity REAL NOT NULL CHECK (quantity > 0),
      PRIMARY KEY (cocktail_id, ingredient_id),
      FOREIGN KEY (cocktail_id) REFERENCES cocktails(cocktail_id) ON DELETE CASCADE,
      FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE RESTRICT
    )
  `,
  ).run();

  // Pasos
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS cocktail_steps (
      step_id INTEGER PRIMARY KEY AUTOINCREMENT,
      cocktail_id INTEGER NOT NULL,
      step_number INTEGER NOT NULL,
      instruction TEXT NOT NULL,
      UNIQUE (cocktail_id, step_number),
      FOREIGN KEY (cocktail_id) REFERENCES cocktails(cocktail_id) ON DELETE CASCADE
    )
  `,
  ).run();

  // Imágenes
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS cocktail_images (
      image_id INTEGER PRIMARY KEY AUTOINCREMENT,
      cocktail_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cocktail_id) REFERENCES cocktails(cocktail_id) ON DELETE CASCADE
    )
  `,
  ).run();

  // Categorías personalizadas
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS categories (
      category_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      UNIQUE (user_id, name),
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `,
  ).run();

  // Asociación cóctel ↔ categoría
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS cocktail_categories (
      cocktail_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      PRIMARY KEY (cocktail_id, category_id),
      FOREIGN KEY (cocktail_id) REFERENCES cocktails(cocktail_id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
    )
  `,
  ).run();

  // Favoritos
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS favorites (
      user_id INTEGER NOT NULL,
      cocktail_id INTEGER NOT NULL,
      marked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, cocktail_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (cocktail_id) REFERENCES cocktails(cocktail_id) ON DELETE CASCADE
    )
  `,
  ).run();

  // Historial de búsqueda
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS search_history (
      search_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      query TEXT NOT NULL,
      searched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `,
  ).run();

  // Historial de preparaciones
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS preparation_history (
      prep_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      cocktail_id INTEGER,
      prepared_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (cocktail_id) REFERENCES cocktails(cocktail_id) ON DELETE SET NULL
    )
  `,
  ).run();

  // Advertencias
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS warnings (
      warning_id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      applies_to_alcoholic_only INTEGER NOT NULL DEFAULT 0
    )
  `,
  ).run();

  // Asociación cóctel ↔ advertencia
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS cocktail_warnings (
      cocktail_id INTEGER NOT NULL,
      warning_id INTEGER NOT NULL,
      PRIMARY KEY (cocktail_id, warning_id),
      FOREIGN KEY (cocktail_id) REFERENCES cocktails(cocktail_id) ON DELETE CASCADE,
      FOREIGN KEY (warning_id) REFERENCES warnings(warning_id) ON DELETE CASCADE
    )
  `,
  ).run();

  // Índices útiles
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_cocktails_name ON cocktails(name)`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_cocktails_difficulty ON cocktails(difficulty)`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id)`).run();
  db.prepare(
    `CREATE INDEX IF NOT EXISTS idx_cocktail_images_cocktail_id ON cocktail_images(cocktail_id)`,
  ).run();
  db.prepare(
    `CREATE INDEX IF NOT EXISTS idx_cocktail_steps_cocktail_id ON cocktail_steps(cocktail_id)`,
  ).run();
}
