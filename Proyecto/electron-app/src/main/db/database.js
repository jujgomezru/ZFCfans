import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Obtener directorio de datos del usuario (escribible)
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'zfcocteles.db');

// eslint-disable-next-line no-console
console.log('📍 Base de datos ubicada en:', dbPath);

const db = new Database(dbPath);

// Función para ejecutar script SQL desde archivo
const executeSchemaFromFile = () => {
  try {
    // Obtener ruta del archivo schema_sqlite.sql
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const schemaPath = path.join(__dirname, 'schema_sqlite.sql');

    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');

      // Dividir el esquema en statements individuales
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      // eslint-disable-next-line no-console
      console.log(`📋 Ejecutando ${statements.length} statements del esquema...`);

      // Ejecutar cada statement
      statements.forEach((statement, index) => {
        try {
          if (statement.trim()) {
            db.exec(statement);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn(`⚠️ Statement ${index + 1} falló (puede ser normal):`, error.message);
        }
      });

      // eslint-disable-next-line no-console
      console.log('✅ Esquema de base de datos aplicado correctamente');
    } else {
      // eslint-disable-next-line no-console
      console.error('❌ No se encontró el archivo schema_sqlite.sql');
      initializeFallbackSchema();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error aplicando esquema:', error);
    initializeFallbackSchema();
  }
};

// Esquema básico de respaldo
const initializeFallbackSchema = () => {
  // eslint-disable-next-line no-console
  console.log('🔄 Aplicando esquema básico de respaldo...');

  // Habilitar foreign keys
  db.pragma('foreign_keys = ON');

  // Crear tablas básicas si no existen
  const basicTables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      color TEXT DEFAULT '#6B7280',
      is_system INTEGER DEFAULT 0,
      id_owner INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS cocktails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      img_url TEXT,
      difficulty TEXT NOT NULL CHECK (difficulty IN ('fácil', 'media', 'difícil')),
      description TEXT,
      additional_notes TEXT,
      preparation_time INTEGER,
      servings INTEGER DEFAULT 1,
      alcohol_content REAL,
      is_featured INTEGER DEFAULT 0,
      id_owner INTEGER REFERENCES users(id),
      id_pairing INTEGER,
      id_category INTEGER REFERENCES categories(id),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
  ];

  basicTables.forEach(sql => {
    try {
      db.exec(sql);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ Error creando tabla básica:', error.message);
    }
  });

  // eslint-disable-next-line no-console
  console.log('✅ Esquema básico aplicado');
};

// Función para verificar si la base de datos está vacía
const isDatabaseEmpty = () => {
  try {
    const result = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
      .all();
    return result.length === 0;
  } catch {
    return true;
  }
};

// Función para obtener información de la base de datos
export const getDatabaseInfo = () => {
  try {
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
      .all();
    const version = db.prepare('PRAGMA user_version').get();

    return {
      path: dbPath,
      tables: tables.map(t => t.name),
      version: version.user_version,
      size: fs.statSync(dbPath).size,
    };
  } catch (error) {
    return {
      path: dbPath,
      tables: [],
      version: 0,
      size: 0,
      error: error.message,
    };
  }
};

// Función para resetear la base de datos (solo para desarrollo)
export const resetDatabase = () => {
  try {
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
      .all();

    tables.forEach(table => {
      db.prepare(`DROP TABLE IF EXISTS ${table.name}`).run();
    });

    executeSchemaFromFile();
    // eslint-disable-next-line no-console
    console.log('🔄 Base de datos reseteada completamente');
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error reseteando base de datos:', error);
    return false;
  }
};

// Inicializar base de datos
if (isDatabaseEmpty()) {
  // eslint-disable-next-line no-console
  console.log('🆕 Base de datos vacía, aplicando esquema completo...');
  executeSchemaFromFile();
} else {
  // eslint-disable-next-line no-console
  console.log('✅ Base de datos existente detectada');

  // Verificar integridad
  try {
    db.pragma('foreign_keys = ON');
    // eslint-disable-next-line no-console
    console.log('✅ Foreign keys habilitadas');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('⚠️ Error habilitando foreign keys:', error.message);
  }
}

export default db;
