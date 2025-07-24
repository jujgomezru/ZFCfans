// import { ipcMain } from 'electron'; // Eliminada porque ya está importada arriba
import CocktailRepository from './db/repositories/CocktailRepository.js';
import db from './db/index.js';

const cocktailRepo = new CocktailRepository(db);

// Handler para crear cócteles
ipcMain.handle('crear-coctel', async (event, datos) => {
  try {
    // Transformar ingredientes y pasos si es necesario
    const ingredientes = datos.ingredientes.map(ing => ({
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
      // agrega más campos si tu repo lo requiere
    }));
    const pasos = datos.pasos.map((step, idx) => ({
      step_number: idx + 1,
      instruction: step.instruction,
      duration: step.duration,
      // agrega más campos si tu repo lo requiere
    }));

    // Construir el objeto final para el repositorio
    const cocktailData = {
      ...datos,
      ingredientes,
      pasos,
    };

    const id = cocktailRepo.createComplete(cocktailData);
    return { ok: true, id };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Database setup
import { initializeDatabase } from './db/config/database.js';

// Repositories
import {
  cocktailRepository,
  // TODO: Uncomment when needed
  // categoryRepository,
  // favoriteRepository,
  // ingredientRepository,
  // notificationRepository,
  recipeRepository,
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

ipcMain.handle('obtener-receta-completa', async (_event, cocktailId) => {
  try {
    console.log('📋 obtener-receta-completa llamado con cocktailId=', cocktailId);

    // 1) Busca la fila de recipes asociada al cóctel
    const rec = recipeRepository.findByCocktailId(cocktailId);
    if (!rec || !rec.id) {
      console.warn(`⚠️ No existe receta para cocktailId=${cocktailId}`);
      return null;
    }

    // 2) Con ese recipe.id, trae los detalles básicos (ingredientes, pasos, etc.)
    const complete = await recipeRepository.getComplete(rec.id);
    if (!complete) {
      return null;
    }

    // 3) Enriquecer con difficulty (de cocktails) y duration total (suma de recipe_steps)
    const difficulty = cocktailRepository.getDifficulty(cocktailId);
    const totalDuration = cocktailRepository.getTotalDuration(cocktailId);

    // 4) Devolver un único objeto con todo
    return {
      ...complete,
      difficulty,
      preparation_time: totalDuration,
    };
  } catch (err) {
    console.error('Error en handler obtener-receta-completa:', err);
    throw err;
  }
});
