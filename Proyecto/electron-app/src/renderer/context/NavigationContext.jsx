import { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

// Orden de páginas para navegación circular (mismo orden que en el Sidebar)
const pageOrder = ['catalogo', 'categorias', 'crear', 'historial', 'manual', 'ajustes'];

// Nombres legibles para las páginas (incluyendo páginas externas)
const pageNames = {
  catalogo: 'Catálogo',
  categorias: 'Categorías',
  crear: 'Crear cóctel',
  historial: 'Historial',
  manual: 'Manual',
  ajustes: 'Ajustes',
  // Páginas externas (no en sidebar)
  usuario: 'Usuario',
  preparacion: 'Preparar cóctel',
  'consumo-responsable': 'Consumo responsable',
  notificaciones: 'Notificaciones',
};

export function NavigationProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('catalogo');

  const navigateTo = pageId => {
    setCurrentPage(pageId);
  };

  const navigateNext = () => {
    // Si estamos en una página externa, ir a catálogo primero
    if (!pageOrder.includes(currentPage)) {
      setCurrentPage('catalogo');
      return;
    }

    const currentIndex = pageOrder.indexOf(currentPage);
    const nextIndex = (currentIndex + 1) % pageOrder.length;
    setCurrentPage(pageOrder[nextIndex]);
  };

  const navigatePrevious = () => {
    // Si estamos en una página externa, ir a catálogo primero
    if (!pageOrder.includes(currentPage)) {
      setCurrentPage('catalogo');
      return;
    }

    const currentIndex = pageOrder.indexOf(currentPage);
    const previousIndex = currentIndex === 0 ? pageOrder.length - 1 : currentIndex - 1;
    setCurrentPage(pageOrder[previousIndex]);
  };

  const getCurrentPageInfo = () => {
    // Si estamos en una página externa al sidebar
    if (!pageOrder.includes(currentPage)) {
      return {
        current: currentPage,
        currentName: pageNames[currentPage] || 'Página desconocida',
        currentIndex: 0,
        total: pageOrder.length,
        next: 'catalogo',
        nextName: pageNames.catalogo,
        previous: 'catalogo',
        previousName: pageNames.catalogo,
      };
    }

    // Si estamos en una página del sidebar, comportamiento normal
    const currentIndex = pageOrder.indexOf(currentPage);
    const nextIndex = (currentIndex + 1) % pageOrder.length;
    const previousIndex = currentIndex === 0 ? pageOrder.length - 1 : currentIndex - 1;

    return {
      current: currentPage,
      currentName: pageNames[currentPage],
      currentIndex: currentIndex + 1,
      total: pageOrder.length,
      next: pageOrder[nextIndex],
      nextName: pageNames[pageOrder[nextIndex]],
      previous: pageOrder[previousIndex],
      previousName: pageNames[pageOrder[previousIndex]],
    };
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        navigateTo,
        navigateNext,
        navigatePrevious,
        getCurrentPageInfo,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
