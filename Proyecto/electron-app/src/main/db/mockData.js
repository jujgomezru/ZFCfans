export function insertarCoctelesIniciales(db) {
  const cocktails = [
    {
      nombre: 'Aperol Spritz',
      categoria: 'aperitivo',
      imagen:
        'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/3A602C62-7F02-4773-ACB2-7603622A3A19/Derivates/5133B835-49A1-4C2C-80EC-74E01842249C.jpg',
    },
    {
      nombre: 'Piña Colada',
      categoria: 'dulce',
      imagen:
        'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/A9467000-4182-4A69-802E-6A36234604C1/Derivates/9cca3d9b-727b-4d23-b633-71dcd23125da.jpg',
    },
    {
      nombre: 'Manhattan',
      categoria: 'digestivo',
      imagen:
        'https://th.bing.com/th/id/OIP.vYIymbjbJdADafbswXH__gAAAA?rs=1&pid=ImgDetMain',
    },
    {
      nombre: 'Mojito',
      categoria: 'aperitivo',
      imagen: 'https://placehold.co/192x192/E2E8F0/4A5568?text=Mojito',
    },
    {
      nombre: 'Margarita',
      categoria: 'aperitivo',
      imagen: 'https://placehold.co/192x192/E2E8F0/4A5568?text=Margarita',
    },
    {
      nombre: 'Old Fashioned',
      categoria: 'digestivo',
      imagen: 'https://placehold.co/192x192/E2E8F0/4A5568?text=Old+Fashioned',
    },
  ];

  const insertCocktail = db.prepare(`
    INSERT INTO cocktails (name, description, difficulty, glass_type, is_alcoholic, creator_user_id)
    VALUES (@name, '', 3, NULL, 1, 1)
  `);

  const insertImage = db.prepare(`
    INSERT INTO cocktail_images (cocktail_id, url)
    VALUES (?, ?)
  `);

  for (const c of cocktails) {
    const info = insertCocktail.run({ name: c.nombre });
    insertImage.run(info.lastInsertRowid, c.imagen);
  }

  console.log('🍸 Cocteles iniciales insertados correctamente');
}
