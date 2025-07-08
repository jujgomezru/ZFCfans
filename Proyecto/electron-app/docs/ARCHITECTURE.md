# 🏛️ Arquitectura - ZFCocteles

Arquitectura **monolítica** con patrones **MVC + Builder**.

## 🎯 Patrón MVC

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│    MODEL    │    │ CONTROLLER   │    │    VIEW     │
│             │◄──►│              │◄──►│             │
│ Coctel.js   │    │ CoctelCtrl   │    │ CoctelCard  │
│ Ingrediente │    │ SearchCtrl   │    │ SearchBar   │
└─────────────┘    └──────────────┘    └─────────────┘
```

### Responsabilidades

- **Model** (`renderer/models/`) → Entidades de dominio
- **View** (`renderer/components/`) → Componentes React
- **Controller** (`renderer/controllers/`) → Lógica de control

## 🔨 Patrón Builder

Construcción fluida de objetos complejos:

```javascript
const mojito = new CoctelBuilder()
  .setNombre('Mojito Clásico')
  .setCategoria('Refrescante')
  .addIngrediente('Ron blanco', '60ml')
  .addIngrediente('Menta fresca', '10 hojas')
  .setDificultad('Fácil')
  .setTiempoPreparacion(5)
  .build();
```

## 🔄 Comunicación IPC

```
React Component ──invoke──► Main Process ──SQL──► SQLite
      ▲                           │
      │                           ▼
   Response ◄────────response──────┘
```

### Flujo de datos:
1. **React** → `window.electronAPI.obtenerCocteles()`
2. **Preload** → `ipcRenderer.invoke('obtener-cocteles')`
3. **Main** → `coctelRepository.obtenerTodosCocteles()`
4. **Repository** → `SELECT * FROM cocteles`
5. **Response** ← ← ← ← Back to React

## 📦 Capas de la Aplicación

### **Main Process** (`src/main/`)
- **main.js** → Ventanas + IPC handlers
- **db/** → SQLite + Repository pattern

### **Renderer Process** (`src/renderer/`)
- **components/** → UI React (View)
- **controllers/** → Control logic (Controller)
- **models/** → Domain entities (Model)
- **builders/** → Object construction
- **services/** → Business logic
- **hooks/** → React state management

### **Preload** (`src/preload/`)
- **preload.js** → Secure IPC bridge

## 🗃️ Estructura de Base de Datos

```sql
CREATE TABLE cocteles (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  ingredientes TEXT,    -- JSON array
  instrucciones TEXT,
  categoria TEXT,
  dificultad TEXT,
  tiempo_preparacion INTEGER,
  imagen_url TEXT,
  created_at DATETIME,
  updated_at DATETIME
);
```

## 🎨 Patrones Implementados

- **Repository** → Acceso a datos
- **Builder** → Construcción de objetos
- **MVC** → Separación de responsabilidades
- **Factory** → Creación de entidades
- **Observer** → React state management

---
**Arquitectura escalable y mantenible 🏗️**