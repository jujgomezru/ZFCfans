# 🧪 Guía de Testing - ZFCocteles

## 📁 Estructura de Tests

```
src/
├── main/tests/              # Tests del proceso principal Electron
│   ├── database.test.js     # Tests de configuración DB
│   ├── coctelRepository.test.js  # Tests de repository
│   └── ipc.test.js          # Tests de comunicación IPC
│
└── renderer/tests/          # Tests de la aplicación React
    ├── components/          # Tests de componentes UI
    │   ├── CoctelCard.test.jsx
    │   ├── SearchBar.test.jsx
    │   └── FilterPanel.test.jsx
    ├── services/            # Tests de lógica de negocio
    │   ├── coctelService.test.js
    │   └── searchService.test.js
    └── utils/               # Tests de funciones auxiliares
        ├── formatters.test.js
        └── validators.test.js
```

## 🎯 Convenciones de Testing

### Ubicación de tests:

- **Tests de Electron** → `src/main/tests/`
- **Tests de React** → `src/renderer/tests/` + subcarpetas por tipo

### Naming conventions:

```bash
# ✅ Correcto
src/main/tests/coctelRepository.test.js
src/renderer/tests/components/CoctelCard.test.jsx
src/renderer/tests/services/coctelService.test.js

# ❌ Incorrecto
src/renderer/components/CoctelCard.test.jsx  # No junto al componente
src/tests/CoctelCardTest.js                 # No fuera de src/
```

## 🧪 Ejemplos de Tests

### Test de Componente React:

```javascript
// src/renderer/tests/components/CoctelCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CoctelCard from '../../components/cards/CoctelCard';

describe('CoctelCard', () => {
  const mockCoctel = {
    id: 1,
    nombre: 'Mojito',
    categoria: 'Refrescante',
    dificultad: 'Fácil',
    ingredientes: ['Ron', 'Menta', 'Lima'],
  };

  it('renderiza información básica del cóctel', () => {
    render(<CoctelCard coctel={mockCoctel} />);

    expect(screen.getByText('Mojito')).toBeInTheDocument();
    expect(screen.getByText('Refrescante')).toBeInTheDocument();
    expect(screen.getByText('Fácil')).toBeInTheDocument();
  });

  it('dispara evento onClick al hacer click', () => {
    const onClickMock = vi.fn();
    render(<CoctelCard coctel={mockCoctel} onClick={onClickMock} />);

    fireEvent.click(screen.getByText('Mojito'));
    expect(onClickMock).toHaveBeenCalledWith(mockCoctel);
  });
});
```

### Test de Builder Pattern:

```javascript
// src/renderer/tests/services/CoctelBuilder.test.js
import { describe, expect, it, beforeEach } from 'vitest';
import CoctelBuilder from '../../builders/CoctelBuilder';

describe('CoctelBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new CoctelBuilder();
  });

  it('construye cóctel básico correctamente', () => {
    const coctel = builder
      .setNombre('Mojito')
      .setCategoria('Refrescante')
      .addIngrediente('Ron', '60ml')
      .setDificultad('Fácil')
      .build();

    expect(coctel.nombre).toBe('Mojito');
    expect(coctel.categoria).toBe('Refrescante');
    expect(coctel.ingredientes).toHaveLength(1);
    expect(coctel.ingredientes[0]).toEqual({ nombre: 'Ron', cantidad: '60ml' });
  });

  it('valida campos obligatorios', () => {
    expect(() => {
      builder.setCategoria('Refrescante').build();
    }).toThrow('El nombre del cóctel es obligatorio');
  });
});
```

### Test de Repository (Electron):

```javascript
// src/main/tests/coctelRepository.test.js
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import coctelRepository from '../db/coctelRepository';
import Database from 'better-sqlite3';

describe('CoctelRepository', () => {
  let testDb;

  beforeEach(() => {
    // Usar base de datos en memoria para tests
    testDb = new Database(':memory:');
    // Setup schema...
  });

  afterEach(() => {
    testDb.close();
  });

  it('guarda cóctel correctamente', () => {
    const coctel = {
      nombre: 'Mojito Test',
      ingredientes: [{ nombre: 'Ron', cantidad: '60ml' }],
      instrucciones: 'Mezclar todo',
    };

    const id = coctelRepository.guardarCoctel(coctel);
    expect(id).toBeGreaterThan(0);
  });

  it('obtiene cócteles por categoría', () => {
    // Setup data...
    const cocteles = coctelRepository.obtenerCoctelesPorCategoria('Refrescante');
    expect(cocteles).toHaveLength(1);
    expect(cocteles[0].categoria).toBe('Refrescante');
  });
});
```

## 🏃‍♂️ Comandos de Testing

```bash
# Ejecutar todos los tests
npm run test

# Tests en modo watch
npm run test -- --watch

# Test específico
npm run test CoctelBuilder.test.js

# Tests con coverage
npm run test -- --coverage

# Tests solo de React
npm run test -- src/renderer/tests

# Tests solo de Electron
npm run test -- src/main/tests
```

## 📊 Coverage Goals

- **Overall coverage:** ≥ 80%
- **Components:** ≥ 85%
- **Services:** ≥ 90%
- **Utils:** ≥ 95%

```bash
# Ver report de coverage
npm run test -- --coverage --reporter=html
# Abre: coverage/index.html
```

## 🎯 Best Practices

### 1. Naming

```javascript
// ✅ Descriptivo
it('should save coctel and return valid ID');

// ❌ Vago
it('test save coctel');
```

### 2. AAA Pattern

```javascript
it('should calculate total ingredients correctly', () => {
  // Arrange
  const builder = new CoctelBuilder();

  // Act
  const coctel = builder.addIngrediente('Ron', '60ml').addIngrediente('Menta', '10 hojas').build();

  // Assert
  expect(coctel.ingredientes).toHaveLength(2);
});
```

### 3. Mocking

```javascript
// Mock window.electronAPI en tests de React
vi.mock('../../utils/electronAPI', () => ({
  obtenerCocteles: vi.fn().mockResolvedValue([]),
}));
```

---

**¡Happy Testing! 🧪✨**
