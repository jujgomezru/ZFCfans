import { getDatabase } from './database.js';

/**
 * Insertar datos de prueba para verificar el nuevo esquema
 */
export function insertSampleData() {
  const db = getDatabase();

  try {
    // Verificar si ya hay datos
    const cocktailCount = db.prepare('SELECT COUNT(*) as count FROM cocktails').get().count;
    if (cocktailCount > 0) {
      // eslint-disable-next-line no-console
      console.log('📊 Ya existen datos en la base de datos, saltando inserción');
      return;
    }

    // eslint-disable-next-line no-console
    console.log('🌱 Insertando datos de muestra...');

    // Insertar usuario de ejemplo
    const userStmt = db.prepare(`
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `);
    const userId = userStmt.run('Admin', 'admin@zfcocteles.com', 'demo_hash').lastInsertRowid;

    // Insertar algunos cócteles de ejemplo
    const cocktailStmt = db.prepare(`
      INSERT INTO cocktails (name, img_url, difficulty, description, preparation_time, alcohol_content, id_owner)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const cocktails = [
      {
        name: 'Mojito Clásico',
        img_url:
          'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/3A602C62-7F02-4773-ACB2-7603622A3A19/Derivates/5133B835-49A1-4C2C-80EC-74E01842249C.jpg',
        difficulty: 'fácil',
        description: 'Refrescante cóctel cubano con menta fresca',
        preparation_time: 5,
        alcohol_content: 12.5,
      },
      {
        name: 'Manhattan',
        img_url: 'https://th.bing.com/th/id/OIP.vYIymbjbJdADafbswXH__gAAAA?rs=1&pid=ImgDetMain',
        difficulty: 'media',
        description: 'Clásico cóctel americano con whisky',
        preparation_time: 3,
        alcohol_content: 28.0,
      },
      {
        name: 'Piña Colada',
        img_url:
          'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/A9467000-4182-4A69-802E-6A36234604C1/Derivates/9cca3d9b-727b-4d23-b633-71dcd23125da.jpg',
        difficulty: 'fácil',
        description: 'Tropical y cremoso cóctel con piña y coco',
        preparation_time: 4,
        alcohol_content: 15.0,
      },
    ];

    cocktails.forEach(cocktail => {
      cocktailStmt.run(
        cocktail.name,
        cocktail.img_url,
        cocktail.difficulty,
        cocktail.description,
        cocktail.preparation_time,
        cocktail.alcohol_content,
        userId,
      );
    });

    // eslint-disable-next-line no-console
    console.log('✅ Datos de muestra insertados correctamente');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error insertando datos de muestra:', error);
  }
}

// Mantener la función original por compatibilidad
export function initializeSchema() {
  // Ya no necesitamos esto porque usamos schema.sql
  // eslint-disable-next-line no-console
  console.log('ℹ️ initializeSchema llamado (usando schema.sql)');
}
