import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Database setup
import { initializeDatabase } from './db/config/database.js';

// Repositories
import {
  cocktailRepository,
  // categoryRepository,
  // favoriteRepository,
  // ingredientRepository,
  // notificationRepository,
  // recipeRepository,
  // userRepository,
} from './db/repositories/index.js';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile('dist/renderer/index.html');
  }
}

app.whenReady().then(() => {
  // Inicializar base de datos
  initializeDatabase();

  // Crear ventana principal
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

console.log('ZFCocteles iniciado correctamente 🥂');

// Canales IPC para gestión de cócteles
ipcMain.on('guardar-coctel', (event, coctel) => {
  try {
    const id = cocktailRepository.createComplete(coctel);
    event.reply('guardar-coctel-respuesta', { success: true, id });
  } catch (error) {
    event.reply('guardar-coctel-respuesta', { success: false, error: error.message });
  }
});

ipcMain.handle('obtener-cocteles', async () => {
  try {
    return { success: true, data: cocktailRepository.findAllWithBasicInfo() };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('obtener-coctel', async (event, id) => {
  try {
    const coctel = cocktailRepository.findCompleteById(id);
    return { success: true, data: coctel };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('buscar-cocteles', async (event, nombre) => {
  try {
    const cocteles = cocktailRepository.searchByName(nombre);
    return { success: true, data: cocteles };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('obtener-estadisticas', async () => {
  try {
    const stats = cocktailRepository.getStatistics();
    return { success: true, data: stats };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
