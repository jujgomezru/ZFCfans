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
npm run format:check # Verificar formato
npm run code-quality # Formato + lint + tests
```

### Build y distribución

```bash
npm run build        # Build completo + instalador
npm run build:renderer  # Solo frontend React
npm run pack         # Empaquetado sin instalador (rápido)
npm run dist         # Crear instalador para Windows/macOS/Linux
```

### Utilidades

```bash
npm run rebuild-sqlite  # Recompilar SQLite manualmente
npm run postinstall     # Configurar dependencias de Electron
```

## 🎯 Workflow de Desarrollo

### 1. Desarrollo diario

```bash
# Iniciar desarrollo
npm run dev

# Antes de commit
npm run code-quality
```

### 2. Convenciones de archivos

| Tipo                  | Ubicación               | Convención                    | Ejemplo               |
| --------------------- | ----------------------- | ----------------------------- | --------------------- |
| **Builders**          | `renderer/builders/`    | PascalCase + `Builder`        | `CoctelBuilder.js`    |
| **Componentes React** | `renderer/components/`  | PascalCase + `.jsx`           | `CoctelCard.jsx`      |
| **Contextos**         | `renderer/context/`     | PascalCase + `Context` suffix | `CoctelContext.js`    |
| **Controllers**       | `renderer/controllers/` | PascalCase + `Controller`     | `CoctelController.js` |
| **Hooks**             | `renderer/hooks/`       | `use` prefix + camelCase      | `useCocteles.js`      |
| **Models**            | `renderer/models/`      | PascalCase                    | `Coctel.js`           |
| **Pages**             | `renderer/pages/`       | PascalCase                    | `Catalogo.jsx`        |
| **Services**          | `renderer/services/`    | camelCase + `Service` suffix  | `coctelService.js`    |
| **Utils**             | `renderer/utils/`       | camelCase                     | `formatters.js`       |
| **Tests**             | Directorio respectivo   | `.test.js`                    | `CoctelCard.test.jsx` |
| **Repositories**      | `main/db/repositories/` | PascalCase + `Repository`     | `CoctelRepository.js` |

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
Asegúrate de que tus commits sean claros y concisos. Usa el formato `tipo: descripción breve`.

```bash
git commit -m "feat: agregar componente CoctelCard"
git commit -m "fix: corregir error en búsqueda de cócteles"
git commit -m "docs: actualizar guía de onboarding"
git commit -m "test: agregar tests para CoctelBuilder"
```

**⚠ Nota:** Asegúrate de que el proyecto compile y pase los tests antes de hacer push.

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
