const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // GESTIÓN DE CÓCTELES
  // Crear cóctel
  guardarCoctel: coctel => ipcRenderer.send('guardar-coctel', coctel),
  onGuardarCoctelResp: callback =>
    ipcRenderer.on('guardar-coctel-respuesta', (event, resp) => callback(resp)),
  offGuardarCoctelResp: callback => ipcRenderer.off('guardar-coctel-respuesta', callback),

  // Obtener cócteles
  obtenerCocteles: () => ipcRenderer.invoke('obtener-cocteles'),
  obtenerCoctel: id => ipcRenderer.invoke('obtener-coctel', id),

  // Búsqueda y filtros
  buscarCocteles: nombre => ipcRenderer.invoke('buscar-cocteles', nombre),

  // Estadísticas
  obtenerEstadisticas: () => ipcRenderer.invoke('obtener-estadisticas'),

  // TODO: Uncomment when needed
  // GESTIÓN DE RECETAS
  obtenerRecetaCompleta: recipeId => ipcRenderer.invoke('obtener-receta-completa', recipeId),

  // GESTIÓN DE FAVORITOS
  obtenerFavoritos: userId => ipcRenderer.invoke('obtener-favoritos', userId),
  esFavorito: (userId, cocktailId) => ipcRenderer.invoke('es-favorito', userId, cocktailId),
  toggleFavorito: (userId, cocktailId) => ipcRenderer.invoke('toggle-favorito', userId, cocktailId),
  agregarFavorito: (userId, cocktailId) =>
    ipcRenderer.invoke('agregar-favorito', userId, cocktailId),
  removerFavorito: (userId, cocktailId) =>
    ipcRenderer.invoke('remover-favorito', userId, cocktailId),

  // GESTIÓN DE CATEGORÍAS
  obtenerCategorias: () => ipcRenderer.invoke('obtener-categorias'),
  obtenerCategoriasDelSistema: () => ipcRenderer.invoke('obtener-categorias-del-sistema'),
  obtenerCategoriasDelUsuario: userId =>
    ipcRenderer.invoke('obtener-categorias-del-usuario', userId),
  crearCategoria: categoryData => ipcRenderer.invoke('crear-categoria', categoryData),
  obtenerCoctelesDeCategoria: categoryId =>
    ipcRenderer.invoke('obtener-cocteles-de-categoria', categoryId),
  agregarCoctelACategoria: (cocktailId, categoryId) =>
    ipcRenderer.invoke('agregar-coctel-a-categoria', cocktailId, categoryId),
  removerCoctelDeCategoria: (cocktailId, categoryId) =>
    ipcRenderer.invoke('remover-coctel-de-categoria', cocktailId, categoryId),
  obtenerCategoriasDelCoctel: cocktailId =>
    ipcRenderer.invoke('obtener-categorias-del-coctel', cocktailId),

  // BÚSQUEDA AVANZADA
  buscarCoctelesConFiltros: filters => ipcRenderer.invoke('buscar-cocteles-con-filtros', filters),
  buscarCoctelesPorIngredientes: ingredients =>
    ipcRenderer.invoke('buscar-cocteles-por-ingredientes', ingredients),
  obtenerSugerenciasBusqueda: (term, limit) =>
    ipcRenderer.invoke('obtener-sugerencias-busqueda', term, limit),
  busquedaFuzzy: searchTerm => ipcRenderer.invoke('busqueda-fuzzy', searchTerm),
  buscarCoctelesPorDificultad: difficulty =>
    ipcRenderer.invoke('buscar-cocteles-por-dificultad', difficulty),
  buscarCoctelesPorCategoria: categoryId =>
    ipcRenderer.invoke('buscar-cocteles-por-categoria', categoryId),
  buscarCoctelesPorAlcohol: isAlcoholic =>
    ipcRenderer.invoke('buscar-cocteles-por-alcohol', isAlcoholic),

  // GESTIÓN DE INGREDIENTES
  // GESTIÓN DE USUARIOS
  // GESTIÓN DE CONFIGURACIÓN
  // GESTIÓN DE NOTIFICACIONES
  // GESTIÓN DE ACOMPAÑAMIENTOS
  // GESTIÓN DE HISTORIAL
});
