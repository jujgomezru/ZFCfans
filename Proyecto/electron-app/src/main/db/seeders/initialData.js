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
      recipe: {
        glass_type: 'stemmed_balloon_glass',
        garnish: 'Rodaja de naranja',
        serving_suggestion: 'Servir con hielo en copa de balón',
        ingredients: [
          { name: 'Prosecco D.O.C.', qty: 90, unit: 'ml' },
          { name: 'Aperol', qty: 60, unit: 'ml' },
          { name: 'Agua con gas', qty: 30, unit: 'ml' },
        ],
        steps: [
          'Coloca cubitos de hielo en una copa de balón',
          'Añade 3 partes de Prosecco D.O.C. (9 cl)',
          'Añade 2 partes de Aperol (6 cl)',
          'Añade 1 parte de agua con gas (3 cl)',
          'Decora con una rodaja de naranja',
        ],
      },
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

  // 5. Asegurar ingredientes base
  const insertIngredient = db.prepare(`
    INSERT OR IGNORE INTO ingredients (name, type, category, description, alcohol_content)
    VALUES (?, 'esencial', ?, ?, ?)
  `);
  cocktails.forEach(c => {
    if (c.recipe) {
      c.recipe.ingredients.forEach(ing => {
        insertIngredient.run(
          ing.name,
          'alcohol', // o 'mixer' si ing.alcohol_content === 0
          `Descripción de ${ing.name}`,
          // si quieres un contenido real, definelo aquí:
          ing.name === 'Agua con gas' ? 0.0 : 11.0,
        );
      });
    }
  });

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

  const insertCocktailStmt = db.prepare(`
    INSERT INTO cocktails (name, img_url, difficulty, description, id_owner)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertCocktailCategory = db.prepare(`
    INSERT INTO cocktail_categories (id_cocktail, id_category)
    VALUES (?, ?)
  `);

  const insertRecipeStmt = db.prepare(
    `INSERT INTO recipes (id_cocktail, glass_type, garnish, serving_suggestion) VALUES (?, ?, ?, ?)`,
  );
  const getIngredientId = db.prepare(`SELECT id FROM ingredients WHERE name = ? LIMIT 1`);
  const insertRecipeIngredient = db.prepare(`
    INSERT INTO recipe_ingredients (id_recipe, id_ingredient, quantity, unit, preparation_note, is_optional, order_index)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `);
  const insertRecipeStep = db.prepare(`
    INSERT INTO recipe_steps (id_recipe, step_number, instruction, duration, is_critical)
    VALUES (?, ?, ?, ?, ?)
  `);

  // 8. Crear categorías únicas
  const categorySet = new Set(cocktails.map(c => c.category_name));
  categorySet.forEach(cat => {
    insertCategory.run(cat, `Categoría de ${cat}`, demoUserId);
  });

  for (const categoryName of categorySet) {
    insertCategory.run(categoryName, `Categoría de ${categoryName}`, demoUserId);
    // eslint-disable-next-line no-console
    console.log(`📁 Categoría creada: ${categoryName}`);
  }

  // 9. Insertar cócteles y recetas dinámicamente
  cocktails.forEach(c => {
    const info = insertCocktailStmt.run(c.name, c.img_url, c.difficulty, c.description, demoUserId);

    const catId = getCategoryId.get(c.category_name).id;
    insertCocktailCategory.run(info.lastInsertRowid, catId);

    if (c.recipe) {
      const recInfo = insertRecipeStmt.run(
        info.lastInsertRowid,
        c.recipe.glass_type,
        c.recipe.garnish,
        c.recipe.serving_suggestion,
      );
      const recipeId = recInfo.lastInsertRowid;

      // ingredients
      c.recipe.ingredients.forEach((ing, idx) => {
        const ingId = getIngredientId.get(ing.name).id;
        insertRecipeIngredient.run(recipeId, ingId, ing.qty, ing.unit, '', idx + 1);
      });

      // steps
      c.recipe.steps.forEach((instr, idx) => {
        insertRecipeStep.run(recipeId, idx + 1, instr, 5, idx === 0 ? 1 : 0);
      });
    }
  });
}
