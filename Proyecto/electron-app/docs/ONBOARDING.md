# 📖 Guía de Onboarding - ZFCocteles

Bienvenido al proyecto ZFCocteles. Esta guía te ayudará a configurar todo lo necesario para empezar a desarrollar.

## 📋 Requisitos Previos

- **Node.js** v20.x o superior
- **Git** configurado
- **VS Code** (recomendado)
- **Windows/macOS/Linux** (multiplataforma)

## 🚀 Configuración Paso a Paso

### 1. Clonar y navegar

```bash
git clone git@github.com:jujgomezru/ZFCfans.git
cd ZFCfans/Proyecto/electron-app
```

### 2. Setup automático

```bash
npm run setup
```

**¿Qué hace este comando?**

- Instala todas las dependencias (`npm install`)
- Recompila módulos nativos para Electron (`electron-rebuild`)
- Configura la base de datos SQLite automáticamente

### 3. Extensiones de VS Code

1. Abre el proyecto: `code .`
2. `Ctrl+Shift+P` → "Extensions: Show Recommended Extensions"
3. Instala todas las extensiones sugeridas

### 4. Verificar instalación

```bash
npm run dev
```

Esto iniciará la aplicación en modo desarrollo. Deberías ver la ventana de Electron con la aplicación React corriendo.

## 🏃‍♂️ Scripts Disponibles

### Desarrollo

```bash
npm run dev          # Electron + React en desarrollo
npm run test         # Ejecutar tests
npm run test -- --watch  # Tests en modo watch
```

### Calidad de código

```bash
npm run lint         # Revisar código con ESLint
npm run lint:fix     # Corregir automáticamente
npm run format       # Formatear con Prettier
npm run code-quality # Formato + lint + tests
```

### Build y distribución

```bash
npm run build        # Build completo + instalador
npm run pack         # Empaquetado sin instalador (rápido)
npm run build:renderer  # Solo frontend React
```

### Utilidades

```bash
npm run rebuild-sqlite  # Recompilar SQLite manualmente
npm run postinstall     # Configurar dependencias de Electron
```

## 🗂️ Estructura de Archivos

```
electron-app/
├── src/
│   ├── main/               # Proceso principal de Electron
│   │   ├── main.js         # Entrada principal
│   │   ├── db/             # Base de datos
│   │   │   ├── database.js     # Configuración SQLite
│   │   │   ├── coctelRepository.js  # Repository pattern
│   │   │   └── index.js        # Exports unificados
│   │   └── tests/          # Tests del proceso principal
│   │
│   ├── preload/            # Scripts de seguridad IPC
│   │   └── preload.js      # Bridge main ↔ renderer
│   │
│   └── renderer/           # Aplicación React
│       ├── components/     # Componentes de UI
│       ├── models/         # Entidades de dominio
│       ├── builders/       # Patrón Builder
│       ├── controllers/    # Lógica de control (MVC)
│       ├── services/       # Lógica de negocio
│       ├── hooks/          # Custom hooks React
│       ├── context/        # Context API
│       ├── utils/          # Funciones auxiliares
│       ├── tests/          # Tests de React
│       │   ├── components/ # Tests de componentes
│       │   ├── services/   # Tests de servicios
│       │   └── utils/      # Tests de utilidades
│       ├── index.html      # Plantilla HTML
│       └── main.jsx        # Entrada React
│
├── public/                 # Assets estáticos
├── docs/                   # Documentación
├── .vscode/                # Configuración VS Code
├── package.json            # Configuración del proyecto
├── vite.config.js          # Configuración Vite
├── vitest.config.mjs       # Configuración testing
└── eslint.config.js        # Configuración linting
```

## 🎯 Workflow de Desarrollo

### 1. Desarrollo diario

```bash
# Terminal 1: Iniciar desarrollo
npm run dev

# Terminal 2: Tests en watch mode
npm run test -- --watch

# Antes de commit
npm run code-quality
```

### 2. Convenciones de archivos

| Tipo                  | Ubicación               | Convención                   | Ejemplo               |
| --------------------- | ----------------------- | ---------------------------- | --------------------- |
| **Componentes React** | `renderer/components/`  | PascalCase + `.jsx`          | `CoctelCard.jsx`      |
| **Hooks**             | `renderer/hooks/`       | camelCase + `use` prefix     | `useCocteles.js`      |
| **Services**          | `renderer/services/`    | camelCase + `Service` suffix | `coctelService.js`    |
| **Models**            | `renderer/models/`      | PascalCase                   | `Coctel.js`           |
| **Builders**          | `renderer/builders/`    | PascalCase + `Builder`       | `CoctelBuilder.js`    |
| **Controllers**       | `renderer/controllers/` | PascalCase + `Controller`    | `CoctelController.js` |

### 3. Tests

```bash
# Tests de React
src/renderer/tests/
├── components/CoctelCard.test.jsx
├── services/coctelService.test.js
└── utils/formatters.test.js

# Tests de Electron
src/main/tests/
├── database.test.js
└── coctelRepository.test.js
```

## 🔄 Git Workflow

### Branches

```bash
# Features
git checkout -b feature/nombre-funcionalidad

# Bugfixes
git checkout -b fix/descripcion-bug

# Docs
git checkout -b docs/actualizar-readme
```

### Commits

Seguimos [Conventional Commits](https://conventionalcommits.org/):

```bash
git commit -m "feat: agregar componente CoctelCard"
git commit -m "fix: corregir error en búsqueda de cócteles"
git commit -m "docs: actualizar guía de onboarding"
git commit -m "test: agregar tests para CoctelBuilder"
```

## ✅ Checklist de Configuración

- [ ] Node.js v20+ instalado
- [ ] Repositorio clonado
- [ ] `npm run setup` ejecutado exitosamente
- [ ] Extensiones de VS Code instaladas
- [ ] `npm run dev` funciona correctamente
- [ ] Tests pasan: `npm run test`
- [ ] Linting funciona: `npm run lint`

## 🆘 ¿Problemas?

Si encuentras algún issue, consulta la [Guía de Troubleshooting](TROUBLESHOOTING.md) o pregunta al equipo.

---

**¡Listo para desarrollar! 🚀**

Próximo paso: Lee la [Guía de Arquitectura](ARCHITECTURE.md) para entender cómo está estructurado el código.
