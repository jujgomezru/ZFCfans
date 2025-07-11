import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { initializeSchema } from './schema.js';
import { insertarCoctelesIniciales } from './mockData.js';

// Obtener directorio de datos del usuario (escribible)
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'zfcocteles.db');

console.log('📍 Base de datos ubicada en:', dbPath);

const db = new Database(dbPath);
initializeSchema(db);
insertarCoctelesIniciales(db);

console.log('✅ Base de datos inicializada correctamente');

export default db;
