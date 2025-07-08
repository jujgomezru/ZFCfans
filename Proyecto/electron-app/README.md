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

# 3. Ejecutar aplicación
npm run dev
```

## 📚 Documentación

- **[📖 Guía de Onboarding](docs/ONBOARDING.md)** - Setup detallado para nuevos desarrolladores
- **[🏛️ Arquitectura](docs/ARCHITECTURE.md)** - Patrones de diseño y estructura del código
- **[🧪 Testing](docs/TESTING.md)** - Guía completa de pruebas
- **[🚀 Deployment](docs/DEPLOYMENT.md)** - Proceso de distribución

## 🏃‍♂️ Scripts Principales

```bash
npm run dev          # Desarrollo
npm run test         # Tests
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

## 🎯 Estado Actual

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
