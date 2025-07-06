import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Crear cóctel
  guardarCoctel: coctel => ipcRenderer.send('guardar-coctel', coctel),
  onGuardarCoctelResp: callback =>
    ipcRenderer.on('guardar-coctel-respuesta', (event, resp) => callback(resp)),

  // Obtener cócteles
  obtenerCocteles: () => ipcRenderer.invoke('obtener-cocteles'),
  obtenerCoctel: id => ipcRenderer.invoke('obtener-coctel', id),

  // Búsqueda y filtros
  buscarCocteles: nombre => ipcRenderer.invoke('buscar-cocteles', nombre),

  // Estadísticas
  obtenerEstadisticas: () => ipcRenderer.invoke('obtener-estadisticas'),
});
