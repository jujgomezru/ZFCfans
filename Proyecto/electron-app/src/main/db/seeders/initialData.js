/**
 * Seeder para datos de ejemplo/demo
 * Ejecuta solo si no hay datos existentes y estamos en modo desarrollo
 */
export function insertInitialCocktails(db, force = false) {
  // Verificar si ya hay datos
  const cocktailCount = db.prepare(`SELECT COUNT(*) as count FROM cocktails`).get().count;
  const userCount = db.prepare(`SELECT COUNT(*) as count FROM users`).get().count;

  if (cocktailCount > 0 && !force) {
    // eslint-disable-next-line no-console
    console.log('📊 Ya existen cócteles en la base de datos, saltando seeder');
    return;
  }

  // Si force=true, limpiar datos existentes primero
  if (force) {
    // eslint-disable-next-line no-console
    console.log('🧹 Limpiando datos existentes...');
    db.prepare('DELETE FROM cocktail_categories').run();
    db.prepare('DELETE FROM cocktails').run();
    db.prepare('DELETE FROM categories WHERE is_system = 0').run(); // Solo las no-sistema
  }

  // eslint-disable-next-line no-console
  console.log('🌱 Ejecutando seeder de datos iniciales...');

  // 1. Crear usuario demo si no existe
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (username, email, password)
    VALUES (?, ?, ?)
  `);

  if (userCount === 0) {
    insertUser.run('demo_user', 'demo@zfcfans.com', 'demo_hash');
    // eslint-disable-next-line no-console
    console.log('👤 Usuario demo creado');
  }

  const cocktails = [
    {
      name: 'Aperol Spritz',
      img_url:
        'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/3A602C62-7F02-4773-ACB2-7603622A3A19/Derivates/5133B835-49A1-4C2C-80EC-74E01842249C.jpg',
      difficulty: 'fácil',
      description: 'Refrescante aperitivo italiano con Aperol y Prosecco',
      category_name: 'aperitivo',
    },
    {
      name: 'Piña Colada',
      img_url:
        'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/A9467000-4182-4A69-802E-6A36234604C1/Derivates/9cca3d9b-727b-4d23-b633-71dcd23125da.jpg',
      difficulty: 'fácil',
      description: 'Tropical y cremoso cóctel caribeño con ron y coco',
      category_name: 'dulce',
    },
    {
      name: 'Manhattan',
      img_url: 'https://th.bing.com/th/id/OIP.vYIymbjbJdADafbswXH__gAAAA?rs=1&pid=ImgDetMain',
      difficulty: 'media',
      description: 'Clásico cóctel americano con whisky y vermut',
      category_name: 'digestivo',
    },
    {
      name: 'Mojito',
      img_url: 'https://placehold.co/192x192/E2E8F0/4A5568?text=Mojito',
      difficulty: 'fácil',
      description: 'Refrescante cóctel cubano con menta y ron blanco',
      category_name: 'aperitivo',
    },
    {
      name: 'Margarita',
      img_url: 'https://placehold.co/192x192/E2E8F0/4A5568?text=Margarita',
      difficulty: 'media',
      description: 'Cóctel mexicano con tequila, triple sec y lima',
      category_name: 'aperitivo',
    },
    {
      name: 'Old Fashioned',
      img_url: 'https://placehold.co/192x192/E2E8F0/4A5568?text=Old+Fashioned',
      difficulty: 'media',
      description: 'Whisky clásico con azúcar, bitters y piel de naranja',
      category_name: 'digestivo',
    },
  ];

  // 2. Obtener el ID del usuario demo (ya sea recién creado o existente)
  const demoUser = db.prepare(`SELECT id FROM users WHERE username = ? LIMIT 1`).get('demo_user');
  const demoUserId = demoUser ? demoUser.id : 1;

  // 3. Preparar statements para inserción eficiente
  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO categories (name, description, id_owner)
    VALUES (?, ?, ?)
  `);

  const getCategoryId = db.prepare(`
    SELECT id FROM categories WHERE name = ?
  `);

  const insertCocktail = db.prepare(`
    INSERT INTO cocktails (name, img_url, difficulty, description, id_owner)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertCocktailCategory = db.prepare(`
    INSERT INTO cocktail_categories (id_cocktail, id_category)
    VALUES (?, ?)
  `);

  // 4. Crear categorías únicas primero
  const categorySet = new Set();
  cocktails.forEach(c => categorySet.add(c.category_name));

  for (const categoryName of categorySet) {
    insertCategory.run(categoryName, `Categoría de ${categoryName}`, demoUserId);
    // eslint-disable-next-line no-console
    console.log(`📁 Categoría creada: ${categoryName}`);
  }

  // 5. Insertar cócteles
  for (const c of cocktails) {
    // Insertar cóctel con el usuario correcto
    const info = insertCocktail.run(c.name, c.img_url, c.difficulty, c.description, demoUserId);

    // Obtener ID de categoría y vincular
    const categoryResult = getCategoryId.get(c.category_name);
    if (categoryResult) {
      insertCocktailCategory.run(info.lastInsertRowid, categoryResult.id);
      // eslint-disable-next-line no-console
      console.log(`🍹 Cóctel "${c.name}" vinculado a categoría "${c.category_name}"`);
    } else {
      // eslint-disable-next-line no-console
      console.warn(`⚠️ No se encontró categoría "${c.category_name}" para cóctel "${c.name}"`);
    }
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Seeder completado: ${cocktails.length} cócteles insertados`);

  // Verificar resultado final
  const finalCocktailCount = db.prepare('SELECT COUNT(*) as count FROM cocktails').get().count;
  const finalCategoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
  const linkedCount = db.prepare('SELECT COUNT(*) as count FROM cocktail_categories').get().count;

  // eslint-disable-next-line no-console
  console.log(
    `📊 Resultado: ${finalCocktailCount} cócteles, ${finalCategoryCount} categorías, ${linkedCount} vínculos`,
  );
}
