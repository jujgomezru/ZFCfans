-- Habilitar claves foráneas en SQLite
PRAGMA foreign_keys = ON;

-- Tabla de usuarios
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabla de categorías (incluyendo favoritos como categoría especial)
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6B7280', -- Color para la UI
    is_system INTEGER DEFAULT 0 CHECK (is_system IN (0, 1)), -- 1 para favoritos, etc.
    id_owner INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabla de maridajes
CREATE TABLE pairings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Tabla principal de cócteles
CREATE TABLE cocktails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    img_url TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('fácil', 'media', 'difícil')),
    description TEXT,
    additional_notes TEXT,
    preparation_time INTEGER, -- en minutos
    servings INTEGER DEFAULT 1,
    alcohol_content REAL, -- porcentaje de alcohol
    is_featured INTEGER DEFAULT 0 CHECK (is_featured IN (0, 1)),
    id_owner INTEGER REFERENCES users(id) ON DELETE SET NULL,
    id_pairing INTEGER REFERENCES pairings(id) ON DELETE SET NULL,
    id_category INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Recetas 1:1 con cóctel
CREATE TABLE recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cocktail INTEGER UNIQUE NOT NULL REFERENCES cocktails(id) ON DELETE CASCADE,
    glass_type TEXT, -- tipo de vaso recomendado
    garnish TEXT, -- decoración
    serving_suggestion TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Instrucciones por receta (1 receta -> N pasos)
CREATE TABLE recipe_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_recipe INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    instruction TEXT NOT NULL,
    duration INTEGER, -- tiempo estimado del paso en segundos
    is_critical INTEGER DEFAULT 0 CHECK (is_critical IN (0, 1)), -- paso crítico
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE (id_recipe, step_number)
);

-- Tabla de ingredientes
CREATE TABLE ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('esencial', 'opcional')),
    category TEXT, -- 'alcohol', 'mixer', 'garnish', 'ice', etc.
    description TEXT,
    alcohol_content REAL DEFAULT 0, -- para bebidas alcohólicas
    created_at TEXT DEFAULT (datetime('now'))
);

-- Relación N:M entre ingredientes y recetas con más detalles
CREATE TABLE recipe_ingredients (
    id_recipe INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    id_ingredient INTEGER NOT NULL REFERENCES ingredients(id),
    quantity REAL NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL, -- 'ml', 'oz', 'cucharadas', 'gotas', etc.
    preparation_note TEXT, -- 'machacado', 'en cubos', etc.
    is_optional INTEGER DEFAULT 0 CHECK (is_optional IN (0, 1)),
    order_index INTEGER DEFAULT 0, -- orden de adición
    PRIMARY KEY (id_recipe, id_ingredient)
);

-- Relación N:M entre cócteles y categorías (un cóctel puede estar en múltiples categorías)
CREATE TABLE cocktail_categories (
    id_cocktail INTEGER NOT NULL REFERENCES cocktails(id) ON DELETE CASCADE,
    id_category INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    added_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (id_cocktail, id_category)
);

-- Historial de preparación con más detalles
CREATE TABLE preparation_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    id_cocktail INTEGER NOT NULL REFERENCES cocktails(id) ON DELETE CASCADE,
    preparation_date TEXT NOT NULL DEFAULT (datetime('now')),
    score INTEGER DEFAULT 0 CHECK (score BETWEEN 0 AND 5),
    comment TEXT,
    preparation_time INTEGER, -- tiempo real de preparación en minutos
    difficulty_experienced TEXT CHECK (difficulty_experienced IN ('fácil', 'media', 'difícil')),
    would_make_again INTEGER DEFAULT 1 CHECK (would_make_again IN (0, 1)),
    created_at TEXT DEFAULT (datetime('now'))
);

-- Tabla para notificaciones del sistema
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('actualizacion', 'advertencia', 'logro', 'recordatorio')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0 CHECK (is_read IN (0, 1)),
    is_system INTEGER DEFAULT 0 CHECK (is_system IN (0, 1)), -- notificación del sistema vs usuario
    related_cocktail_id INTEGER REFERENCES cocktails(id) ON DELETE SET NULL,
    created_at TEXT DEFAULT (datetime('now')),
    read_at TEXT
);

-- Tabla para configuración de usuario
CREATE TABLE user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    notifications_enabled INTEGER DEFAULT 1 CHECK (notifications_enabled IN (0, 1)),
    inventory_reminders INTEGER DEFAULT 1 CHECK (inventory_reminders IN (0, 1)),
    default_serving_size INTEGER DEFAULT 1,
    preferred_units TEXT DEFAULT 'ml' CHECK (preferred_units IN ('ml', 'oz')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Índices para optimizar consultas
CREATE INDEX idx_cocktails_difficulty ON cocktails(difficulty);
CREATE INDEX idx_cocktails_category ON cocktails(id_category);
CREATE INDEX idx_cocktails_owner ON cocktails(id_owner);
CREATE INDEX idx_preparation_history_user ON preparation_history(id_user);
CREATE INDEX idx_preparation_history_date ON preparation_history(preparation_date);
CREATE INDEX idx_notifications_user_unread ON notifications(id_user, is_read);
CREATE INDEX idx_recipe_steps_recipe ON recipe_steps(id_recipe, step_number);

-- Insertar categorías del sistema por defecto
INSERT INTO categories (name, description, color, is_system) VALUES
    ('Favoritos', 'Cócteles marcados como favoritos', '#FCD34D', 1),
    ('Recientes', 'Cócteles preparados recientemente', '#60A5FA', 1),
    ('Por Probar', 'Cócteles pendientes de preparar', '#A78BFA', 1);

-- Insertar algunos maridajes básicos
INSERT INTO pairings (name, description) VALUES
    ('Aperitivo', 'Ideal para abrir el apetito'),
    ('Digestivo', 'Perfecto después de las comidas'),
    ('Cóctel de tarde', 'Para disfrutar en reuniones sociales'),
    ('Cóctel nocturno', 'Para momentos de relajación'),
    ('Celebración', 'Para ocasiones especiales');

-- Insertar algunos ingredientes básicos
INSERT INTO ingredients (name, type, category, alcohol_content) VALUES
    ('Ron blanco', 'esencial', 'alcohol', 40.0),
    ('Ron oscuro', 'esencial', 'alcohol', 40.0),
    ('Vodka', 'esencial', 'alcohol', 40.0),
    ('Gin', 'esencial', 'alcohol', 37.5),
    ('Tequila', 'esencial', 'alcohol', 40.0),
    ('Whisky', 'esencial', 'alcohol', 40.0),
    ('Limón', 'esencial', 'fruta', 0.0),
    ('Lima', 'esencial', 'fruta', 0.0),
    ('Menta fresca', 'esencial', 'hierba', 0.0),
    ('Azúcar blanca', 'esencial', 'endulzante', 0.0),
    ('Agua con gas', 'esencial', 'mixer', 0.0),
    ('Hielo', 'esencial', 'hielo', 0.0),
    ('Angostura', 'opcional', 'bitter', 44.7),
    ('Triple sec', 'opcional', 'licor', 25.0),
    ('Granadina', 'opcional', 'jarabe', 0.0);
