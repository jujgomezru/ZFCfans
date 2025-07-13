import { insertarCoctelesIniciales } from './initialData.js';

/**
 * Ejecutar todos los seeders
 */
export function runAllSeeders(db) {
  console.log('🌱 Ejecutando seeders...');

  try {
    insertarCoctelesIniciales(db);
    console.log('✅ Seeders ejecutados correctamente');
  } catch (error) {
    console.error('❌ Error ejecutando seeders:', error);
    throw error;
  }
}

// Exportar seeders individuales
export { insertarCoctelesIniciales };
