const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile('dist/renderer/index.html');
  }
}

app.whenReady().then(createWindow);

console.log('Funcionaaa');

// Ejemplo de canal IPC
ipcMain.on('guardar-coctel', (event, coctel) => {
  db.guardarCoctel(coctel);
  event.reply('guardar-coctel-respuesta', { success: true });
});
