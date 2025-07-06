import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

// Obtener directorio de datos del usuario (escribible)
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'zfcocteles.db');

console.log('📍 Base de datos ubicada en:', dbPath);

const db = new Database(dbPath);

// Inicializar esquema de base de datos
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS cocteles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    ingredientes TEXT NOT NULL,
    instrucciones TEXT NOT NULL,
    categoria TEXT,
    dificultad TEXT,
    tiempo_preparacion INTEGER,
    imagen_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`,
).run();

// Crear índices para mejorar performance
db.prepare('CREATE INDEX IF NOT EXISTS idx_categoria ON cocteles(categoria)').run();
db.prepare('CREATE INDEX IF NOT EXISTS idx_nombre ON cocteles(nombre)').run();

console.log('✅ Base de datos inicializada correctamente');

export default db;
