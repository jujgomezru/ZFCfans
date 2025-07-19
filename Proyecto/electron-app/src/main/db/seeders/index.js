/**
 * Índice de seeders - Punto central para ejecutar todos los seeders
 */
import { insertInitialCocktails } from './initialData.js';

/**
 * Ejecutar todos los seeders en el orden correcto
 * @param {object} db - Instancia de la base de datos
 * @param {boolean} force - Forzar ejecución aunque ya existan datos
 */
export function runAllSeeders(db, force = false) {
  try {
    // Solo ejecutar en desarrollo o si se fuerza
    if (process.env.NODE_ENV === 'production' && !force) {
      // eslint-disable-next-line no-console
      console.log('⚠️  Seeders saltados en producción');
      return;
    }

    // eslint-disable-next-line no-console
    console.log('🌱 Iniciando seeders...');

    // Forzar recreación en desarrollo para datos limpios
    const shouldForce = force || process.env.NODE_ENV === 'development';

    // Ejecutar seeders en orden
    insertInitialCocktails(db, shouldForce);

    // eslint-disable-next-line no-console
    console.log('✅ Todos los seeders completados');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error ejecutando seeders:', error);
    throw error;
  }
}

// Exportar seeders individuales para uso específico
export { insertInitialCocktails as insertarCoctelesIniciales };
