const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // GESTIÓN DE CÓCTELES
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

  // TODO: Uncomment when needed
  // GESTIÓN DE RECETAS
  obtenerRecetaCompleta: recipeId =>
    ipcRenderer.invoke('obtener-receta-completa', recipeId),

  crearCoctel: (form) => 
    ipcRenderer.invoke('crear-coctel', form),

  
  // GESTIÓN DE CATEGORÍAS
  // GESTIÓN DE INGREDIENTES
  // GESTIÓN DE USUARIOS
  // GESTIÓN DE FAVORITOS
  // GESTIÓN DE CONFIGURACIÓN
  // GESTIÓN DE NOTIFICACIONES
  // GESTIÓN DE ACOMPAÑAMIENTOS
  // GESTIÓN DE HISTORIAL
});
