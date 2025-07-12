# 🏛️ Arquitectura - ZFCocteles

Aplicación **monolítica** basada en **Electron + React + Vite** con patrón **Repository** y arquitectura por capas.

## 🎯 Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          🥂 ZFCocteles - Arquitectura Monolítica                │
└─────────────────────────────────────────────────────────────────────────────────┘

     👤
   Usuario  ──────────────┐
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         Aplicación Electron                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                      Main Process (Node.js)                             │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │   │
│  │  │   Window    │  │   IPC       │  │  Database   │  │   File      │    │   │
│  │  │  Manager    │  │  Handlers   │  │  Manager    │  │  System     │    │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │   │
│  └─────────────────────────────────────┬───────────────────────────────────┘   │
│                                        │ IPC Communication                     │
│  ┌─────────────────────────────────────▼───────────────────────────────────┐   │
│  │                    Renderer Process (React)                             │   │
│  │                                                                          │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │                        UI Layer (View)                          │   │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │   │   │
│  │  │  │  Header +   │  │  Sidebar +  │  │   Pages +   │              │   │   │
│  │  │  │ Navigation  │  │   Menu      │  │ Components  │              │   │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘              │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  │                                  │                                      │   │
│  │  ┌─────────────────────────────────▼─────────────────────────────────┐ │   │
│  │  │                    Context & State Management                     │ │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │ │   │
│  │  │  │ Navigation  │  │    User     │  │   Search    │              │ │   │
│  │  │  │  Context    │  │   Context   │  │   Context   │              │ │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘              │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  │                                  │                                    │   │
│  │  ┌─────────────────────────────────▼─────────────────────────────────┐ │   │
│  │  │                       Business Logic Layer                       │ │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │ │   │
│  │  │  │   Coctel    │  │ Categories  │  │   Recipe    │              │ │   │
│  │  │  │  Service    │  │  Service    │  │   Service   │              │ │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘              │ │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │ │   │
│  │  │  │    User     │  │Ingredients  │  │Notification │              │ │   │
│  │  │  │   Service   │  │   Service   │  │   Service   │              │ │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘              │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  │                                  │                                    │   │
│  │  ┌─────────────────────────────────▼─────────────────────────────────┐ │   │
│  │  │                      Data Access Layer                           │ │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │ │   │
│  │  │  │   Coctel    │  │ Categories  │  │   Recipe    │              │ │   │
│  │  │  │ Repository  │  │ Repository  │  │ Repository  │              │ │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘              │ │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │ │   │
│  │  │  │    User     │  │Ingredients  │  │Notification │              │ │   │
│  │  │  │ Repository  │  │ Repository  │  │ Repository  │              │ │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘              │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────┬───────────────────────────────────────┘
                                          │
                                          ▼
                              ┌─────────────────────┐
                              │   Database SQLite   │
                              │                     │
                              │ ┌─────────────────┐ │
                              │ │   cocktails     │ │
                              │ │   categories    │ │
                              │ │   ingredients   │ │
                              │ │   recipes       │ │
                              │ │   users         │ │
                              │ │ notifications   │ │
                              │ │preparation_hist │ │
                              │ └─────────────────┘ │
                              └─────────────────────┘
```

## 🔄 Comunicación entre Procesos (IPC)

```
React Component ──invoke──► Preload ──invoke──► Main Process ──SQL──► SQLite
      ▲                          │                    │                    │
      │                          │                    ▼                    ▼
   UI Update ◄──response─────response──response──Repository Pattern──Query Result
```

### Flujo de Datos Detallado:

1. **React Component** → `window.electronAPI.getCocktails()`
2. **Preload Script** → `ipcRenderer.invoke('get-cocktails')`
3. **Main Process** → `ipcMain.handle('get-cocktails', handler)`
4. **Repository** → `coctelRepository.getAll()`
5. **SQLite** → Ejecuta consulta y retorna datos
6. **Response** ← ← ← ← De vuelta a React

## 📦 Arquitectura por Capas

### **🖥️ Main Process** (`src/main/`)

#### **Core Files:**

- **main.js** → Entry point, window management, IPC setup
- **preload.js** → Secure bridge entre main y renderer

#### **Database Layer** (`src/main/db/`):

- **database.js** → SQLite connection & schema initialization
- **schema_sqlite.sql** → Complete database schema
- **index.js** → Repository exports & initialization

#### **Repository Pattern:**

- **coctelRepository.js** → Cocktail CRUD & business queries
- **categoryRepository.js** → Category management & relationships
- **ingredientRepository.js** → Ingredient management & statistics
- **recipeRepository.js** → Recipe steps & ingredients management
- **userRepository.js** → User authentication & preferences
- **notificationRepository.js** → Notification system

### **⚛️ Renderer Process** (`src/renderer/`)

#### **UI Layer** (`components/`):

```
components/
├── layout/
│   ├── Header.jsx        → Top navigation bar
│   ├── Sidebar.jsx       → Main menu navigation
│   ├── MainContent.jsx   → Content wrapper
│   └── Footer.jsx        → Bottom bar
├── common/              → Reusable UI components
├── cocteles/           → Cocktail-specific components
└── icons/              → SVG icon components
```

#### **Pages** (`pages/`):

- **CatalogoPage.jsx** → Cocktail catalog & search
- **CategoriasPage.jsx** → Category management
- **CrearPage.jsx** → Create new cocktails
- **ManualPage.jsx** → User guides & tutorials
- **HistorialPage.jsx** → Preparation history
- **AjustesPage.jsx** → App settings
- **NotificacionesPage.jsx** → Notification center
- **UsuarioPage.jsx** → User profile & stats

#### **State Management** (`context/`):

- **NavigationContext.jsx** → Global navigation state

#### **Business Logic** (`services/`, `controllers/`, `hooks/`):

- Domain-specific logic and React state management

## 🗃️ Base de Datos (SQLite)

### **Esquema Completo:**

```sql
-- Tabla principal de cócteles
CREATE TABLE cocktails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK(difficulty IN ('fácil', 'medio', 'difícil')),
  preparation_time INTEGER,
  alcohol_content REAL,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categorías del sistema y personalizadas
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,
  is_system BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Ingredientes con tipos y información nutricional
CREATE TABLE ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  type TEXT CHECK(type IN ('esencial', 'garnish', 'opcional')),
  category TEXT,
  alcohol_content REAL DEFAULT 0,
  description TEXT,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Recetas base por cóctel
CREATE TABLE recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_cocktail INTEGER UNIQUE NOT NULL,
  glass_type TEXT,
  garnish TEXT,
  serving_suggestion TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_cocktail) REFERENCES cocktails(id) ON DELETE CASCADE
);

-- Pasos detallados de preparación
CREATE TABLE recipe_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_recipe INTEGER NOT NULL,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  duration INTEGER,
  is_critical BOOLEAN DEFAULT 0,
  FOREIGN KEY (id_recipe) REFERENCES recipes(id) ON DELETE CASCADE
);

-- Ingredientes específicos por receta
CREATE TABLE recipe_ingredients (
  id_recipe INTEGER NOT NULL,
  id_ingredient INTEGER NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  preparation_note TEXT,
  is_optional BOOLEAN DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  PRIMARY KEY (id_recipe, id_ingredient),
  FOREIGN KEY (id_recipe) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (id_ingredient) REFERENCES ingredients(id)
);

-- Relación muchos a muchos: cócteles ↔ categorías
CREATE TABLE cocktail_categories (
  id_cocktail INTEGER NOT NULL,
  id_category INTEGER NOT NULL,
  PRIMARY KEY (id_cocktail, id_category),
  FOREIGN KEY (id_cocktail) REFERENCES cocktails(id) ON DELETE CASCADE,
  FOREIGN KEY (id_category) REFERENCES categories(id) ON DELETE CASCADE
);

-- Usuarios del sistema
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  preferences TEXT DEFAULT '{}',
  experience_level TEXT DEFAULT 'principiante',
  age INTEGER,
  active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Historial de preparaciones por usuario
CREATE TABLE user_cocktail_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_user INTEGER NOT NULL,
  id_cocktail INTEGER NOT NULL,
  preparation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  rating INTEGER CHECK(rating BETWEEN 1 AND 5),
  notes TEXT,
  duration INTEGER,
  success BOOLEAN DEFAULT 1,
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (id_cocktail) REFERENCES cocktails(id)
);

-- Sistema de notificaciones
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_user INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('info', 'warning', 'success', 'error', 'achievement', 'reminder', 'new_cocktail', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data TEXT DEFAULT '{}',
  read_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  scheduled_for DATETIME,
  priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high')),
  expires_at DATETIME,
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🎨 Patrones de Diseño Implementados

### **🗄️ Repository Pattern**

Encapsula toda la lógica de acceso a datos:

```javascript
// Ejemplo: CoctelRepository
const CoctelRepository = {
  // CRUD básico
  create: cocktailData => {
    /* INSERT logic */
  },
  getById: id => {
    /* SELECT with JOINs */
  },
  getAll: filters => {
    /* Complex queries */
  },
  update: (id, data) => {
    /* UPDATE with validation */
  },
  delete: id => {
    /* CASCADE delete */
  },

  // Métodos específicos de dominio
  getWithRecipe: id => {
    /* Complex JOIN query */
  },
  searchByIngredients: ingredients => {
    /* Advanced search */
  },
  getMostPopular: () => {
    /* Statistics query */
  },
  addToFavorites: (userId, cocktailId) => {
    /* M:N relationship */
  },
};
```

### **🔧 Builder Pattern**

Para construcción fluida de entidades complejas:

```javascript
const mojito = new CoctelBuilder()
  .setName('Mojito Clásico')
  .setDifficulty('fácil')
  .setCategory('Refrescante')
  .addIngredient('Ron blanco', 60, 'ml')
  .addIngredient('Menta fresca', 10, 'hojas')
  .addIngredient('Azúcar', 2, 'cucharaditas')
  .addStep('Machacar suavemente la menta', 1, true)
  .addStep('Agregar ron y azúcar', 2, false)
  .setGlass('highball')
  .setPreparationTime(5)
  .build();
```

### **🔄 Context Pattern (React)**

Para gestión de estado global:

```javascript
// NavigationContext.jsx
const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('catalogo');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const value = {
    currentPage,
    setCurrentPage,
    sidebarCollapsed,
    setSidebarCollapsed,
    searchQuery,
    setSearchQuery,
    navigate: page => setCurrentPage(page),
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};
```

### **🏭 Factory Pattern**

Para creación consistente de entidades:

```javascript
class NotificationFactory {
  static createAchievement(userId, achievementData) {
    return {
      id_user: userId,
      type: 'achievement',
      title: '¡Logro desbloqueado!',
      message: achievementData.message,
      priority: 'high',
      data: JSON.stringify(achievementData),
    };
  }

  static createReminder(userId, reminderData) {
    return {
      id_user: userId,
      type: 'reminder',
      title: reminderData.title,
      message: reminderData.message,
      scheduled_for: reminderData.scheduledFor,
      expires_at: reminderData.expiresAt,
    };
  }
}
```

## 🚀 Características de la Arquitectura

### **✅ Ventajas de la Arquitectura Monolítica:**

- **Simplicidad de desarrollo**: Todo en una aplicación
- **Fácil debugging**: Un solo proceso de despliegue
- **Performance**: No latencia de red entre servicios
- **Transacciones ACID**: SQLite garantiza consistencia
- **Distribución simple**: Un solo ejecutable

### **✅ Separación de Responsabilidades:**

- **Main Process**: Sistema operativo, seguridad, base de datos
- **Renderer Process**: UI, interacciones de usuario, estado
- **Repository Layer**: Acceso a datos, consultas complejas
- **Context Layer**: Estado global, navegación
- **Component Layer**: UI reutilizable, presentación

### **✅ Escalabilidad:**

- **Modular**: Fácil agregar nuevos repositorios/servicios
- **Extensible**: Nuevas funcionalidades sin refactoring
- **Mantenible**: Patrones consistentes en todo el código
- **Testeable**: Cada capa puede testearse independientemente

## 🔧 Tecnologías Principales

- **Electron** → Desktop app framework
- **React 19** → UI library with latest features
- **Vite** → Fast build tool and dev server
- **SQLite + better-sqlite3** → Embedded database
- **Tailwind CSS** → Utility-first CSS framework
- **ESLint + Prettier** → Code quality and formatting

## 📋 Páginas y Funcionalidades

### **🍹 Páginas Principales:**

1. **Catálogo** → Búsqueda y visualización de cócteles
2. **Categorías** → Gestión de favoritos y categorías personalizadas
3. **Crear** → Formulario de creación de nuevos cócteles
4. **Manual** → Guías, tutoriales y tips
5. **Historial** → Registro de preparaciones y estadísticas
6. **Ajustes** → Configuración de la aplicación
7. **Notificaciones** → Centro de notificaciones y logros
8. **Usuario** → Perfil, preferencias y estadísticas personales

### **🔍 Funcionalidades Avanzadas:**

- **Búsqueda inteligente** por nombre, ingredientes, dificultad
- **Sistema de favoritos** y categorías personalizadas
- **Historial de preparaciones** con ratings y notas
- **Notificaciones automáticas** de logros y recordatorios
- **Estadísticas de usuario** y nivel de experiencia
- **Recetas detalladas** con pasos e ingredientes específicos
- **Gestión de ingredientes** con información nutricional

---

**🏗️ Arquitectura robusta, escalable y mantenible para la gestión completa de cócteles** 🍹✨
