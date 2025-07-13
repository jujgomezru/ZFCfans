import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { initializeSchema } from './schema.js';
import { runAllSeeders } from '../seeders/index.js';

// Obtener directorio de datos del usuario (escribible)
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'zfcocteles.db');

console.log('📍 Base de datos ubicada en:', dbPath);

const db = new Database(dbPath);
initializeSchema(db);
runAllSeeders(db);

console.log('✅ Base de datos inicializada correctamente');

export default db;
