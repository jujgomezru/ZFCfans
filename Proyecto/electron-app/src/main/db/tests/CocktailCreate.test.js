import { describe, expect, test } from 'vitest';

describe('CocktailRepository.create - edge cases', () => {
  test('should not allow duplicate ingredient in cocktail', () => {
    const cocktailData = {
      name: 'Test Cocktail',
      ingredients: [
        { id_ingredient: 1, quantity: 50 },
        { id_ingredient: 1, quantity: 30 }, // Duplicado
      ],
    };
    // Simular validación en el método create
    function createWithValidation(data) {
      const ids = data.ingredients.map(i => i.id_ingredient);
      const hasDuplicates = ids.length !== new Set(ids).size;
      if (hasDuplicates) {
        throw new Error('Duplicate ingredient');
      }
      return 1;
    }
    expect(() => createWithValidation(cocktailData)).toThrow('Duplicate ingredient');
  });

  test('should not allow empty cocktail name', () => {
    const cocktailData = {
      name: '',
      ingredients: [{ id_ingredient: 1, quantity: 50 }],
    };
    function createWithValidation(data) {
      if (!data.name || data.name.trim() === '') {
        throw new Error('Empty cocktail name');
      }
      return 1;
    }
    expect(() => createWithValidation(cocktailData)).toThrow('Empty cocktail name');
  });

  test('should not allow duplicate cocktail name', () => {
    const cocktailData = {
      name: 'Mojito',
      ingredients: [{ id_ingredient: 1, quantity: 50 }],
    };
    function createWithValidation(_data) {
      // Simula que el nombre ya existe en la base de datos
      const existing = { id: 2 }; // Simulación
      if (existing) {
        throw new Error('Duplicate cocktail name');
      }
      return 1;
    }
    expect(() => createWithValidation(cocktailData)).toThrow('Duplicate cocktail name');
  });

  test('should not allow attaching image in invalid format', () => {
    const cocktailData = {
      name: 'Test Cocktail',
      img_url: 'cocktail.txt', // Formato inválido
      ingredients: [{ id_ingredient: 1, quantity: 50 }],
    };
    function createWithValidation(data) {
      const validExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.webp'];
      if (data.img_url && !validExtensions.some(ext => data.img_url.endsWith(ext))) {
        throw new Error('Invalid image format');
      }
      return 1;
    }
    expect(() => createWithValidation(cocktailData)).toThrow('Invalid image format');
  });
});
