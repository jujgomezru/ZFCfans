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
    // ===== DATOS DE PRUEBA PARA TESTING DE UI =====
    {
      name: 'Test: Cóctel Completo',
      img_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop',
      difficulty: 'difícil',
      description: 'Cóctel de prueba con TODOS los datos completos para testing',
      category_name: 'digestivo',
      recipe: {
        glass_type: 'coupe_glass',
        garnish: 'Twist de naranja flambeado',
        serving_suggestion: 'Servir muy frío con decoración elaborada',
        preparation_time: 8,
        ingredients: [
          {
            name: 'Whisky Premium',
            qty: 2,
            unit: 'oz',
            optional: false,
            notes: 'Preferiblemente añejado',
          },
          {
            name: 'Licor de hierbas',
            qty: 0.5,
            unit: 'oz',
            optional: false,
            notes: 'Temperatura ambiente',
          },
          {
            name: 'Jarabe simple',
            qty: 0.25,
            unit: 'oz',
            optional: true,
            notes: 'Solo si se prefiere más dulce',
          },
          {
            name: 'Bitters aromáticos',
            qty: 2,
            unit: 'dashes',
            optional: false,
            notes: 'Agregar al final',
          },
          {
            name: 'Hielo de calidad',
            qty: 1,
            unit: 'cup',
            optional: false,
            notes: 'Hielo grande y claro',
          },
        ],
        steps: [
          {
            instruction: 'Enfriar la copa coupe en el congelador por 5 minutos antes de servir',
            duration: 5,
            critical: false,
          },
          {
            instruction:
              'En un vaso mezclador, añadir el whisky y el licor de hierbas con hielo abundante',
            duration: 1,
            critical: true,
          },
          {
            instruction:
              'Remover vigorosamente durante 30 segundos hasta alcanzar la dilución perfecta',
            duration: 0.5,
            critical: true,
          },
          {
            instruction: 'Probar y ajustar dulzor con jarabe si es necesario (paso opcional)',
            duration: 1,
            critical: false,
          },
          {
            instruction:
              'Colar con colador fino en la copa fría, eliminando cualquier rastro de hielo',
            duration: 1,
            critical: true,
          },
          {
            instruction: 'Añadir 2 dashes de bitters aromáticos sobre la superficie',
            duration: 0.5,
            critical: false,
          },
          {
            instruction: 'Flamear el twist de naranja sobre la copa y colocar como decoración',
            duration: 1,
            critical: false,
          },
          {
            instruction: 'Servir inmediatamente mientras está a temperatura perfecta',
            duration: 0,
            critical: true,
          },
        ],
      },
    },
    {
      name: 'Test: Sin Imagen',
      img_url: '', // Imagen vacía para probar fallback
      difficulty: 'fácil',
      description: 'Prueba del sistema de imagen por defecto cuando no hay URL',
      category_name: 'aperitivo',
      recipe: {
        glass_type: 'highball_glass',
        preparation_time: 2,
        ingredients: [
          { name: 'Agua mineral', qty: 200, unit: 'ml' },
          { name: 'Limón', qty: 0.5, unit: 'unidad' },
          { name: 'Hielo', qty: 5, unit: 'cubos' },
        ],
        steps: [
          { instruction: 'Llenar el vaso con hielo', duration: 1, critical: false },
          { instruction: 'Añadir agua mineral y jugo de limón', duration: 1, critical: false },
          { instruction: 'Mezclar suavemente y servir', duration: 0.5, critical: false },
        ],
      },
    },
    {
      name: 'Test: Solo Ingredientes',
      img_url: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=300&h=300&fit=crop',
      difficulty: 'media',
      description: 'Cóctel para probar UI cuando NO hay pasos de preparación',
      category_name: 'dulce',
      recipe: {
        glass_type: 'martini_glass',
        garnish: 'Cereza al marrasquino',
        preparation_time: 3,
        ingredients: [
          { name: 'Vodka premium', qty: 2, unit: 'oz', notes: 'Bien frío' },
          { name: 'Licor de cereza', qty: 0.5, unit: 'oz', optional: true },
          { name: 'Jugo de cranberry', qty: 1, unit: 'oz' },
          { name: 'Jugo de lima fresco', qty: 0.25, unit: 'oz' },
        ],
        steps: [], // Array vacío para probar UI sin pasos
      },
    },
    {
      name: 'Test: Solo Pasos',
      img_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop',
      difficulty: 'media',
      description: 'Cóctel para probar UI cuando NO hay lista de ingredientes',
      category_name: 'digestivo',
      recipe: {
        glass_type: 'rocks_glass',
        preparation_time: 4,
        ingredients: [], // Array vacío para probar UI sin ingredientes
        steps: [
          {
            instruction: 'Este es un cóctel misterioso donde solo conoces los pasos',
            duration: 1,
            critical: false,
          },
          {
            instruction: 'Paso para probar la navegación cuando faltan ingredientes',
            duration: 2,
            critical: true,
          },
          {
            instruction: 'Verificar que la UI maneja elegantemente la falta de ingredientes',
            duration: 1,
            critical: false,
          },
        ],
      },
    },
    {
      name: 'Test: Datos Mínimos',
      img_url: null, // null para probar otro caso de fallback
      difficulty: 'fácil', // Sin badge especial, pero valor válido
      description: 'Cóctel con datos mínimos para probar todos los fallbacks',
      category_name: 'aperitivo',
      recipe: {
        // Solo datos mínimos
        ingredients: [{ name: 'Ingrediente básico', qty: 1, unit: 'unidad' }],
        steps: [{ instruction: 'Paso básico de preparación' }],
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
    INSERT INTO cocktails (name, img_url, difficulty, description, preparation_time, id_owner)
    VALUES (?, ?, ?, ?, ?, ?)
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
    VALUES (?, ?, ?, ?, ?, ?, ?)
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
    const info = insertCocktailStmt.run(
      c.name,
      c.img_url,
      c.difficulty,
      c.description,
      c.recipe?.preparation_time || null,
      demoUserId,
    );

    const catId = getCategoryId.get(c.category_name).id;
    insertCocktailCategory.run(info.lastInsertRowid, catId);

    if (c.recipe) {
      const recInfo = insertRecipeStmt.run(
        info.lastInsertRowid,
        c.recipe.glass_type || null,
        c.recipe.garnish || null,
        c.recipe.serving_suggestion || null,
      );
      const recipeId = recInfo.lastInsertRowid;

      // ingredients
      if (c.recipe.ingredients && c.recipe.ingredients.length > 0) {
        c.recipe.ingredients.forEach((ing, idx) => {
          const ingResult = getIngredientId.get(ing.name);
          if (ingResult) {
            insertRecipeIngredient.run(
              recipeId,
              ingResult.id,
              ing.qty,
              ing.unit,
              ing.notes || '',
              ing.optional ? 1 : 0,
              idx + 1,
            );
          }
        });
      }

      // steps
      if (c.recipe.steps && c.recipe.steps.length > 0) {
        c.recipe.steps.forEach((step, idx) => {
          const instruction = typeof step === 'string' ? step : step.instruction;
          const duration = typeof step === 'object' ? step.duration || 5 : 5;
          const critical = typeof step === 'object' ? (step.critical ? 1 : 0) : idx === 0 ? 1 : 0;

          insertRecipeStep.run(recipeId, idx + 1, instruction, duration, critical);
        });
      }
    }
  });
}
