import { describe, it, expect } from 'vitest';
import CoctelBuilder from '../builders/CoctelBuilder.js';

describe('CoctelBuilder', () => {
  it('construye un cóctel básico correctamente', () => {
    const coctel = new CoctelBuilder()
      .setNombre('Mojito')
      .addIngrediente('Ron', '50ml')
      .addIngrediente('Hierbabuena', '10 hojas')
      .build();

    expect(coctel.nombre).toBe('Mojito');
    expect(coctel.ingredientes).toHaveLength(2);
  });
});
