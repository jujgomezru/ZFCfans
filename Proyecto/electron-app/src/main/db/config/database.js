import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { runAllSeeders } from '../seeders/index.js';

let db = null;

// Obtener la ruta de la base de datos
function getDatabasePath() {
  if (process.env.NODE_ENV === 'test') {
    return ':memory:';
  }

  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'zfcocteles.db');

  // Crear directorio si no existe
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  return dbPath;
}

// Ejecutar script SQL desde archivo
function executeSchemaFromFile(database) {
  try {
    // Obtener ruta del archivo schema.sql
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const schemaPath = path.join(__dirname, 'schema.sql');

    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');

      // eslint-disable-next-line no-console
      console.log('📋 Aplicando esquema de base de datos...');

      // Ejecutar todo el esquema (ahora con IF NOT EXISTS)
      try {
        database.exec(schema);
        // eslint-disable-next-line no-console
        console.log('✅ Esquema de base de datos aplicado correctamente');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ Error aplicando esquema:', error.message);
        throw error;
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('❌ Archivo schema.sql no encontrado:', schemaPath);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error ejecutando esquema:', error);
    throw error;
  }
}

// Inicializar la base de datos
export function initializeDatabase() {
  if (db) {
    return db;
  }

  try {
    const dbPath = getDatabasePath();
    console.log('📍 Inicializando base de datos en:', dbPath);

    // Crear conexión
    db = new Database(dbPath);

    // Configurar opciones
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // Ejecutar esquema desde archivo
    executeSchemaFromFile(db);

    // Ejecutar seeders para datos de ejemplo
    runAllSeeders(db);

    // eslint-disable-next-line no-console
    console.log('✅ Base de datos inicializada correctamente');
    return db;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  }
}

// Obtener la instancia de la base de datos
export function getDatabase() {
  if (!db) {
    return initializeDatabase();
  }
  return db;
}

// Cerrar la base de datos
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    // eslint-disable-next-line no-console
    console.log('📴 Base de datos cerrada');
  }
}

export default getDatabase;
