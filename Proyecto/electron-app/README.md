# 🥂 ZFCocteles - Aplicación de Gestión de Cócteles

Aplicación de escritorio construida con **Electron**, **React** y **Vite** para gestionar recetas de cócteles, utilizando una base de datos local (`better-sqlite3`).
El proyecto sigue una arquitectura **monolítica**, basada en los patrones de diseño **Builder + MVC**.

---

## 🚀 Configuración Inicial

> ✅ **Requisitos:** Node.js v20.x

> 💡 **Recomendado:** Usar nvm para manejar versiones de Node.js

### 1. Clonar el repositorio

```bash
git clone git@github.com:jujgomezru/ZFCfans.git
cd ZFCfans/Proyecto/electron-app
```

### 2. Configurar el entorno por primera vez

```bash
npm run setup
```

Este ejecuta automáticamente los siguientes comandos:

- `npm install` → instala dependencias
- `electron-rebuild` → recompila los binarios nativos (better-sqlite3) para Electron

### 3. Instalar extensiones recomendadas (VS Code)

1. Abre el proyecto en Visual Studio Code
2. Presiona `Ctrl+Shift+P` → `"Extensions: Show Recommended Extensions"`
3. Instala todas las sugeridas para un entorno óptimo

### 4. Ejecutar la aplicación

```bash
npm run dev
```

## 🏃‍♂️ Scripts disponibles

```bash
# 🔧 Instala todo y recompila native modules
npm run setup

# 🚀 Ejecuta la app en modo desarrollo (Electron + Vite)
npm run dev

# 📦 Compila todo y crea instalador (Windows: .exe, macOS: .dmg)
npm run build

# 📦 Compila el frontend con Vite
npm run build:renderer

# Compila y empaqueta sin crear instalador (más rápido para pruebas)
npm run pack

# Compila y crea instalador sin subirlo (para distribución local)
npm run dist

# 🧪 Ejecuta los tests con Vitest
npm run test

# 📏 Ejecuta ESLint para revisar estilo, errores y convenciones
npm run lint

# 🛠 Corrige automáticamente problemas de estilo y convenciones con ESLint
npm run lint:fix

# 🎨 Formatea el código con Prettier
npm run format

# ✅ Verifica el formato del código con Prettier
npm run format:check

# 📊 Ejecuta pruebas de calidad de código (formato + lint + tests)
npm run code-quality

# 🛠 Recompila better-sqlite3 para Electron (puede usarse manualmente)
npm run rebuild-sqlite

# ⚙️ Instala dependencias de Electron y recompila native modules
npm run postinstall

```

## 🏗️ Estructura del proyecto

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
  │   │   ├── tests /              # Pruebas unitarias del proceso principal
  │   │   └── main.js              # Entrada principal (ESM)
  │   ├── preload/                 # Preload scripts (IPC seguro)
  │   └── renderer/                # Aplicación React (Vista + lógica)
  │       ├── assets/              # Recursos estáticos (imágenes, estilos, etc.)
  │       ├── builders/            # Builders para construir entidades
  │       ├── components/          # Componentes React (Vista)
  │       ├── contexts/            # Contextos de React (Estado global)
  │       ├── controllers/         # Controladores (MVC)
  │       ├── hooks/               # Hooks personalizados de React
  │       ├── models/              # Modelos de dominio
  │       ├── services/            # Lógica de negocio y persistencia
  │       ├── tests/               # Pruebas unitarias (Vitest)
  │       |   ├── components/      # Pruebas de componentes
  │       |   ├── services/        # Pruebas de componentes de React
  |       |   └── utils/           # Pruebas de utilidades
  │       ├── utils/               # Utilidades y helpers
  │       ├── index.html           # Plantilla HTML principal
  │       └── main.jsx             # Entrada de la aplicación (React)
  ├── .gitignore                   # Archivos y carpetas ignorados por Git
  ├── .prettierrc                  # Configuración de Prettier
  ├── eslint.config.js             # Configuración de ESLint
  ├── package.json                 # Configuración del proyecto
  ├── vite.config.js               # Configuración de Vite (ESM)
  └── vitest.config.mjs            # Configuración de Vitest (ESM)

```

## 🛠️ Stack tecnológico

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

## 🎯 Desarrollo actual

### Estado del proyecto:

- ✅ **Configuración base completa** (ESM, tooling, testing)
- ✅ **Base de datos configurada** (SQLite con better-sqlite3)
- ✅ **IPC establecido** (comunicación Electron ↔ React)
- ✅ **Testing setup** (100%)
- 🔧 **Interfaz en desarrollo** (migrando desde prototipo HTML)
- 🔧 **Arquitectura MVC + Builder** (en implementación)
- ❌ **Modelos y builders de cócteles** (pendiente)
- ❌ **Controladores y servicios** (pendiente)
- ❌ **Pruebas unitarias** (pendiente)
- ❌ **Documentación completa** (pendiente)
- ❌ **Empaquetado final** (pendiente)

### Próximos pasos:

1. Migrar diseño de `ZFCoctelesv1.html` a componentes React (en desarrollo)
2. Implementar modelos y builders para cócteles

- Crear modelos de datos para cócteles, ingredientes y categorías
- Implementar lógica de construcción de cócteles con patrones Builder

3. Desarrollar controladores y servicios

- Implementar controladores para manejar la lógica de negocio
- Crear servicios para interactuar con la base de datos y la lógica de aplicación
- Implementar lógica de negocio para manipular cócteles, ingredientes y categorías

4. Completar pruebas unitarias con Vitest

- Implementar pruebas para modelos, builders y controladores
- Asegurar cobertura de código adecuada

5. Completar documentación del proyecto
6. Preparar empaquetado final con electron-builder
7. Realizar pruebas de usuario y ajustes finales

---

## 🏁 ¡Comenzemos!

```bash
npm run dev
```

Esto iniciará:

- **Vite dev server** en `http://localhost:5173`
- **Electron app** que carga automáticamente la aplicación React
