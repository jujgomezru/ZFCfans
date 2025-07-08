# 🚀 Deployment - ZFCocteles

Guía para builds y distribución multiplataforma.

## 📦 Tipos de Build

```bash
# Desarrollo rápido (sin instalador)
npm run pack
# → release/win-unpacked/ZFCocteles.exe

# Instalador completo
npm run dist
# → release/ZFCocteles Setup 1.0.0.exe

# Solo frontend
npm run build:renderer
# → dist/renderer/
```

## 🎯 Targets Soportados

| Plataforma  | Output                  | Requiere            |
| ----------- | ----------------------- | ------------------- |
| **Windows** | `.exe` + NSIS installer | Windows/Linux/macOS |
| **macOS**   | `.dmg`                  | macOS únicamente    |
| **Linux**   | `AppImage`              | Linux/macOS         |

## ⚙️ Configuración

### Windows

```json
"win": {
  "target": "nsis",
  "arch": ["x64"],
  "icon": "public/icons/icon.ico"
}
```

### macOS

```json
"mac": {
  "target": "dmg",
  "icon": "public/icon.icns"
}
```

### Linux

```json
"linux": {
  "target": "AppImage",
  "icon": "public/icons/icon.png"
}
```

## 📋 Pre-deployment Checklist

- [ ] `npm run test` pasa
- [ ] `npm run code-quality` limpio
- [ ] Íconos en `public/icons/`
- [ ] Versión actualizada en `package.json`

## 🔧 Troubleshooting

### Error: "Module did not self-register"

```bash
npm run rebuild-sqlite
```

### Build falla

```bash
rm -rf dist/ release/ node_modules/
npm install
npm run build
```

### Íconos no aparecen

- **Windows:** `public/icons/icon.ico` (256x256)
- **macOS:** `public/icon.icns` (512x512)
- **Linux:** `public/icons/icon.png` (512x512)

## 📊 Información de Build

### Archivos incluidos:

- `src/main/**/*` → Proceso principal
- `src/preload/**/*` → Scripts preload
- `dist/renderer/**/*` → React compilado
- `node_modules/**/*` → Dependencias
- `public/**/*` → Assets estáticos

### Base de datos:

La DB se crea automáticamente en:

- **Windows:** `%APPDATA%/ZFCocteles/`
- **macOS:** `~/Library/Application Support/ZFCocteles/`
- **Linux:** `~/.config/ZFCocteles/`

## 🚀 CI/CD (Futuro)

```yaml
# GitHub Actions ejemplo
- name: Build for Windows
  run: npm run dist

- name: Upload Release
  uses: actions/upload-artifact@v3
  with:
    name: ZFCocteles-Windows
    path: release/*.exe
```

---

**Deploy confiable y multiplataforma 🚀**
