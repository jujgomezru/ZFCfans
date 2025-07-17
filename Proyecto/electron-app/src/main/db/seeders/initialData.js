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
      name: 'Piña Colada',
      img_url:
        'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/A9467000-4182-4A69-802E-6A36234604C1/Derivates/9cca3d9b-727b-4d23-b633-71dcd23125da.jpg',
      difficulty: 'fácil',
      description: 'Tropical y cremoso cóctel caribeño con ron y coco',
      category_name: 'dulce',
      recipe: {
        glass_type: 'hurricane_glass',
        garnish: 'Rodaja u hoja de piña',
        serving_suggestion: 'Servir en vaso huracán con hielo y decorar con piña',
        ingredients: [
          { name: 'Ron blanco', qty: 6, unit: 'oz' },
          { name: 'Crema de coco (e.g., Coco Lopez)', qty: 6, unit: 'oz' },
          { name: 'Jugo de piña', qty: 6, unit: 'oz' },
          { name: 'Cubos de piña congelados', qty: 0.5, unit: 'cup' },
          { name: 'Hielo', qty: 4, unit: 'cups' },
          { name: 'Ron dorado o añejo', qty: 4, unit: 'oz' },
        ],
        steps: [
          'Coloca ron blanco, crema de coco, jugo de piña, cubos de piña congelados y hielo en una licuadora',
          'Procesa hasta obtener una mezcla homogénea y espumosa',
          'Vierte la mezcla en vasos huracán y añade el ron dorado o añejo por encima para que flote (opcional)',
          'Decora con rodajas u hojas de piña y sirve inmediatamente',
        ],
      },
    },
    {
      name: 'Manhattan',
      img_url: 'https://th.bing.com/th/id/OIP.vYIymbjbJdADafbswXH__gAAAA?rs=1&pid=ImgDetMain',
      difficulty: 'media',
      description: 'Clásico cóctel americano con whisky y vermut',
      category_name: 'digestivo',
      recipe: {
        glass_type: 'coupe_glass',
        garnish: 'Guinda en almíbar (o twist de limón)',
        serving_suggestion: 'Servir en copa Nick & Nora o copa coupe bien fría',
        ingredients: [
          { name: 'Whisky de centeno (rye whiskey)', qty: 2, unit: 'oz' },
          { name: 'Vermut rojo dulce', qty: 1, unit: 'oz' },
          { name: 'Angostura bitters', qty: 2, unit: 'dashes' },
        ],
        steps: [
          'Añade el whisky de centeno, vermut dulce y Angostura bitters en un vaso mezclador con hielo',
          'Remueve con cucharilla hasta que la mezcla esté bien fría y ligeramente diluida',
          'Cuela en una copa Nick & Nora o copa coupe fría',
          'Decora con una guinda en almíbar (o twist de limón) y sirve inmediatamente',
        ],
      },
    },
    {
      name: 'Mojito',
      img_url: 'https://placehold.co/192x192/E2E8F0/4A5568?text=Mojito',
      difficulty: 'fácil',
      description: 'Clásico cóctel cubano con menta, miel y lima',
      category_name: 'aperitivo',
      recipe: {
        glass_type: 'highball_glass',
        garnish: 'Rama de menta fresca',
        serving_suggestion:
          'Servir en vaso highball con hielo y decorar con ramita de menta fresca',
        ingredients: [
          { name: 'Hojas de menta fresca', qty: 10, unit: 'hojas' },
          { name: 'Miel', qty: 1, unit: 'tsp' },
          { name: 'Jugo de lima', qty: 2, unit: 'tbsp' },
          { name: 'Cubos de hielo', qty: 1, unit: 'cup' },
          { name: 'Ron blanco', qty: 2, unit: 'oz' },
          { name: 'Club soda', qty: 2, unit: 'oz' },
        ],
        steps: [
          'Muele suavemente las hojas de menta con miel y jugo de lima en un vaso highball',
          'Añade el ron blanco y los cubos de hielo al vaso',
          'Remueve ligeramente con una cucharilla para mezclar',
          'Completa con club soda hasta llenar y decora con una ramita de menta fresca',
          'Sirve inmediatamente',
        ],
      },
    },
    {
      name: 'Margarita',
      img_url: 'https://placehold.co/192x192/E2E8F0/4A5568?text=Margarita',
      difficulty: 'media',
      description: 'Cóctel mexicano refrescante con tequila, triple sec y lima',
      category_name: 'aperitivo',
      recipe: {
        glass_type: 'cocktail_glass',
        garnish: 'Rodaja de lima y borde salado en el vaso',
        serving_suggestion: 'Servir en copa con borde salado y un cubo de hielo grande',
        ingredients: [
          { name: 'Tequila blanco', qty: 2, unit: 'oz' },
          { name: 'Triple sec', qty: 1.5, unit: 'oz' },
          { name: 'Jugo de lima fresco', qty: 1, unit: 'oz' },
          { name: 'Sal gruesa', qty: 1, unit: 'tsp' },
          { name: 'Cubo de hielo grande', qty: 1, unit: 'unit' },
          { name: 'Cubos de hielo adicionales', qty: 1, unit: 'cup' },
        ],
        steps: [
          'Moja el borde de un vaso con una rodaja de lima y rebózalo en sal gruesa',
          'Coloca un cubo de hielo grande en el vaso y enfría el interior',
          'Llena un shaker con hielo fresco y añade tequila, triple sec y jugo de lima',
          'Agita vigorosamente hasta que el exterior del shaker se cristalice',
          'Cuela la mezcla en el vaso preparado y decora con una rodaja de lima',
        ],
      },
    },
    {
      name: 'Old Fashioned',
      img_url: 'https://placehold.co/192x192/E2E8F0/4A5568?text=Old+Fashioned',
      difficulty: 'media',
      description: 'Cóctel clásico con bourbon, azúcar y bitters',
      category_name: 'digestivo',
      recipe: {
        glass_type: 'old_fashioned_glass',
        garnish: 'Twist de naranja y guinda Luxardo',
        serving_suggestion: 'Servir en vaso Old Fashioned con un cubo de hielo grande',
        ingredients: [
          { name: 'Bourbon o whisky de centeno', qty: 2, unit: 'oz' },
          { name: 'Azúcar demerara', qty: 1, unit: 'tsp' },
          { name: 'Angostura bitters', qty: 2, unit: 'dashes' },
          { name: 'Agua', qty: 1, unit: 'tsp' },
          { name: 'Twist de piel de naranja', qty: 1, unit: 'unit' },
          { name: 'Guinda Luxardo', qty: 1, unit: 'unit' },
        ],
        steps: [
          'Disuelve azúcar demerara con agua y bitters en vaso mezclador',
          'Añade bourbon y hielo y remueve hasta enfriar',
          'Cuela en vaso con cubo grande',
          'Retuerce piel de naranja sobre la bebida y añade guinda',
          'Sirve inmediatamente',
        ],
      },
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
