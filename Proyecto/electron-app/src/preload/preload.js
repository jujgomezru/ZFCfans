const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  guardarCoctel: (coctel) => ipcRenderer.send('guardar-coctel', coctel),
  onGuardarCoctelResp: (callback) =>
    ipcRenderer.on('guardar-coctel-respuesta', (event, resp) => callback(resp)),
});
