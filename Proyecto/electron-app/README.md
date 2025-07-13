# 🥂 ZFCocteles - Aplicación de Gestión de Cócteles

Aplicación de escritorio construida con **Electron**, **React** y **Vite** para gestionar recetas de cócteles, utilizando una base de datos local (`better-sqlite3`).

El proyecto sigue una arquitectura **monolítica**, basada en los patrones de diseño **Builder + MVC**.

---

## 🚀 Inicio Rápido

```bash
# 1. Clonar repositorio
git clone git@github.com:jujgomezru/ZFCfans.git
cd ZFCfans/Proyecto/electron-app

# 2. Configurar automáticamente
npm run setup

# 3. Ejecutar aplicación en modo desarrollo
npm run dev
```

## 📚 Documentación

- **[📖 Guía de Onboarding](docs/ONBOARDING.md)** - Setup detallado para nuevos desarrolladores
- **[🏛️ Arquitectura](docs/ARCHITECTURE.md)** - Patrones de diseño y estructura del código
- **[🗄️ Base de Datos](docs/DB.md)** - Esquema y relaciones de la base de datos
- **[🎯 Estado del Proyecto](docs/STATE.md)** - Progreso y estado actual del proyecto y los casos de uso
- **[🧪 Testing](docs/TESTING.md)** - Guía completa de pruebas
- **[🚀 Deployment](docs/DEPLOYMENT.md)** - Proceso de distribución

## 🏃‍♂️ Scripts Principales

```bash
npm run dev          # Desarrollo
npm run test         # Ejecutar tests
npm run build        # Build completo
npm run code-quality # Calidad de código
```

[Ver todos los scripts disponibles →](docs/ONBOARDING.md#scripts-disponibles)

## 🏗️ Estructura del Proyecto

```
ZFCFANS/
├── .vscode/                     # Configuración del entorno de desarrollo.
├── ...
  electron-app/
  ├── docs                         # Documentación del proyecto
  ├── public/                      # Archivos estáticos opcionales
  ├── src/
  │   ├── main/                    # Proceso principal de Electron
  │   │   ├── db/                  # Conexión y lógica de la base de datos (SQLite)
  │   │   │   ├── config/          # Configuración de la base de datos
  │   │   │   ├── repositories/    # Repositorios (patrón Repository y Singleton)
  │   │   |   └── seeders/             # Inicialización de datos
  │   │   └── tests /              # Pruebas unitarias del proceso principal
  │   ├── preload/                 # Preload scripts (IPC seguro, para comunicación entre procesos)
  │   └── renderer/                # Aplicación React (Vista + lógica)
  │       ├── assets/              # Recursos estáticos (imágenes, estilos, etc.)
  │       ├── builders/            # Builders para construir entidades (patrón Builder)
  │       ├── components/          # Componentes React (Componetes reutilizables)
  │       ├── context/             # Contextos de React (Estado global)
  │       ├── controllers/         # Controladores (Conectan Repository con UI)
  │       ├── hooks/               # Hooks personalizados de React (lógica reutilizable)
  │       ├── models/              # Modelos de dominio (interfaces y entidades)
  |       ├── pages/               # Páginas de la aplicación
  │       ├── services/            # Lógica de negocio y persistencia
  │       ├── tests/               # Pruebas unitarias (Vitest)
  │       |   ├── components/      # Pruebas de componentes
  │       |   ├── services/        # Pruebas de componentes de React
  |       |   └── utils/           # Pruebas de utilidades
  │       ├── utils/               # Utilidades y helpers
  │       ├── App.jsx              # Componente raíz de la aplicación
  │       ├── index.html           # Plantilla HTML principal
  │       └── main.jsx             # Entrada de la aplicación (React)
  ├── .gitignore                   # Archivos y carpetas ignorados por Git
  ├── .prettierrc                  # Configuración de Prettier
  ├── eslint.config.js             # Configuración de ESLint
  ├── package.json                 # Configuración del proyecto
  ├── tailwind.config.js           # Configuración de Tailwind CSS
  ├── vite.config.js               # Configuración de Vite (ESM)
  └── vitest.config.mjs            # Configuración de Vitest (ESM)

```

## 🎯 Estado Actual - Julio 2025

### ✅ Completado

- ✅ **Configuración base completa** (ESM, tooling, testing)
- ✅ **IPC establecido** (comunicación Electron ↔ React)
- ✅ **Interfaz React** (Prototipo de HTML migrado a React)
- ✅ **Base de datos robusta** (SQLite con esquema normalizado y constraints)
- ✅ **Patrón Repository completo** (BaseRepository + herencia)

### 🔧 En desarrollo

- 🔧 **Controladores MVC** (conectando Repository con UI)
- 🔧 **Builders de entidades** (construcción fluida de objetos)
- 🔧 **Servicios de negocio** (lógica de aplicación)

### 📋 Próximos Pasos

- 📋 **Pruebas unitarias completas** (coverage objetivo 90%+)
- 📋 **Documentación de casos de uso** (implementación específica)
- 📋 **Empaquetado final** (distribución multiplataforma)

[Ver estado detallado del proyecto →](docs/STATE.md)

## 🏆 Arquitectura

El proyecto implementa una **arquitectura hexagonal moderna** con:

- **Repository Pattern** para acceso a datos
- **MVC + Builder** para lógica de aplicación
- **Sistema de categorías flexible** (favoritos, personalizadas, del sistema)
- **Base de datos normalizada** con relaciones N:M y constraints
- **Patrón Singleton** para repositorios

[Ver más detalles de la arquitectura del proyecto →](docs/ARCHITECTURE.md)

## 📢 Guía para Integrantes del Equipo

### 🏗️ Cómo aprovechar la arquitectura actual

#### Para Frontend (React/UI)

```javascript
// Los repositorios ya están listos - úsalos así:
import { cocktailRepository, favoriteRepository } from '../db/repositories';

// Obtener cócteles
const cocktails = cocktailRepository.findAll();
const userCocktails = cocktailRepository.findByUserId(userId);

// Gestionar favoritos (sistema avanzado de categorías)
const favorites = favoriteRepository.findByUserId(userId);
favoriteRepository.toggleFavorite(userId, cocktailId);
```

#### Para Backend/DB

```javascript
// BaseRepository ya implementado - hereda para nuevas entidades:
class MyRepository extends BaseRepository {
  constructor() {
    super('my_table', 'id');
  }

  // Métodos personalizados aquí
  findByCustomCriteria(criteria) {
    return this.db.prepare('SELECT * FROM my_table WHERE...').all(criteria);
  }
}
```

#### Para Testing/QA

```javascript
// Tests base disponibles en src/renderer/tests/
// Patrón a seguir:
describe('Repository Tests', () => {
  beforeEach(() => {
    // Database en memoria para tests
  });
});
```

## 📊 Patrones de diseño implementados

| Patrón         | Ubicación                   | Propósito                        |
| -------------- | --------------------------- | -------------------------------- |
| **Repository** | `src/main/db/repositories/` | Abstracción del acceso a datos   |
| **Singleton**  | `repositories/index.js`     | Una instancia por repositorio    |
| **Builder**    | `src/renderer/builders/`    | Construcción fluida de entidades |
| **MVC**        | `src/renderer/`             | Separación de responsabilidades  |
| **Strategy**   | `FavoriteRepository`        | Categorías vs tabla separada     |

## 🛠️ Stack Tecnológico

| Herramienta          | Rol                                                              |
| -------------------- | ---------------------------------------------------------------- |
| **Electron**         | Framework de escritorio multiplataforma                          |
| **React**            | Librería de interfaces declarativas (Vista)                      |
| **Vite**             | Dev server + empaquetador ultrarrápido para React                |
| **Better SQLite3**   | Base de datos embebida eficiente (módulo nativo)                 |
| **Vitest**           | Framework de testing moderno, compatible con Vite                |
| **ESLint**           | Linter para mantener código limpio y coherente                   |
| **Prettier**         | Formateador automático de código                                 |
| **concurrently**     | Ejecuta Vite + Electron en paralelo en modo desarrollo           |
| **cross-env**        | Define variables de entorno multiplataforma                      |
| **electron-rebuild** | Recompila módulos nativos (como SQLite) para usarse con Electron |

---

**¿Nuevo en el proyecto?** Comienza con la [Guía de Onboarding](docs/ONBOARDING.md) 🚀
