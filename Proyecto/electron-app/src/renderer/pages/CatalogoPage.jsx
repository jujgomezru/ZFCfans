import { useCallback, useEffect, useState } from 'react';
import CoctelGrid from '../components/cocteles/CoctelGrid';
import SearchFilters from '../components/search/SearchFilters';
import { useSearch } from '../hooks/useSearch';
import { useCocktails } from '../hooks/useCocktails';

function CatalogoPage() {
  const {
    results: globalSearchResults,
    loading: globalSearchLoading,
    error: globalSearchError,
    searchWithFilters,
    clearResults,
  } = useSearch();

  const {
    cocktails: allCocktails,
    loading: cocktailsLoading,
    error: cocktailsError,
    loadCocktails,
  } = useCocktails();

  const [filters, setFilters] = useState({});
  const [showingFilteredResults, setShowingFilteredResults] = useState(false);

  // Cargar todos los cócteles al inicio
  useEffect(() => {
    loadCocktails();
  }, [loadCocktails]);

  // Escuchar cambios en resultados de búsqueda global
  useEffect(() => {
    if (globalSearchResults.length > 0) {
      setShowingFilteredResults(true);
    }
  }, [globalSearchResults]);

  // Manejar cambios en filtros
  const handleFiltersChange = useCallback(
    async newFilters => {
      setFilters(newFilters);

      // Si hay filtros activos, hacer búsqueda
      const hasActiveFilters = Object.keys(newFilters).length > 0;

      if (hasActiveFilters) {
        await searchWithFilters(newFilters);
        setShowingFilteredResults(true);
      } else {
        // Si no hay filtros, mostrar todos
        setShowingFilteredResults(false);
        clearResults();
      }
    },
    [searchWithFilters, clearResults],
  );

  // Limpiar filtros
  const handleClearFilters = useCallback(() => {
    setFilters({});
    setShowingFilteredResults(false);
    clearResults();
  }, [clearResults]);

  // Determinar qué cócteles mostrar y estados
  const hasGlobalSearch = globalSearchResults.length > 0;
  const hasLocalFilters = showingFilteredResults && Object.keys(filters).length > 0;
  const hasActiveSearch = hasGlobalSearch || hasLocalFilters;

  let displayCocktails, isLoading, error, emptyMessage;

  if (hasActiveSearch) {
    displayCocktails = globalSearchResults;
    isLoading = globalSearchLoading;
    error = globalSearchError;

    if (hasGlobalSearch) {
      emptyMessage = 'No se encontraron cócteles que coincidan con tu búsqueda';
    } else {
      emptyMessage = 'No se encontraron cócteles que coincidan con los filtros aplicados';
    }
  } else {
    displayCocktails = allCocktails;
    isLoading = cocktailsLoading;
    error = cocktailsError;
    emptyMessage = 'No hay cócteles disponibles';
  }

  return (
    <>
      {/* Header with filters */}
      <div className="sticky top-0 z-10 bg-[#FDFBF8] border-b border-gray-200/30">
        <div className="p-8">
          {/* Title and Filters in same row */}
          <div className="flex items-center justify-between mb-6 gap-16">
            <h2 className="text-4xl font-bold text-gray-800">Catálogo</h2>

            {/* Filters */}
            <SearchFilters
              onFiltersChange={handleFiltersChange}
              onClear={handleClearFilters}
              initialFilters={filters}
            />
          </div>

          {/* Results info - Solo mostrar cuando hay resultados exitosos */}
          {hasActiveSearch && displayCocktails.length > 0 && !error && (
            <div className="text-sm text-gray-600">
              <span>
                Se encontraron <strong>{displayCocktails.length}</strong> resultados
                {hasGlobalSearch ? ' para tu búsqueda' : ' con los filtros aplicados'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Cocktail cards grid */}
      <div className="p-8">
        <CoctelGrid
          cocktails={displayCocktails}
          loading={isLoading}
          error={error}
          emptyMessage={emptyMessage}
        />
      </div>
    </>
  );
}

export default CatalogoPage;
