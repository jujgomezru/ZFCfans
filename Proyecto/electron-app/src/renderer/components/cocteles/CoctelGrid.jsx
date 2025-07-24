import { useEffect } from 'react';
import CoctelCard from './CoctelCard';
import { useCocktails } from '../../hooks/useCocktails';

function CoctelGrid({
  cocktails: externalCocktails,
  loading: externalLoading,
  error: externalError,
  emptyMessage = 'No hay cócteles disponibles.',
}) {
  const {
    cocktails: internalCocktails,
    loading: internalLoading,
    error: internalError,
    loadCocktails,
  } = useCocktails();

  // Si no se pasan cócteles externos, usar los internos
  const cocktails = externalCocktails ?? internalCocktails;
  const loading = externalLoading ?? internalLoading;
  const error = externalError ?? internalError;

  useEffect(() => {
    // Solo cargar cócteles internos si no se pasan externos
    if (!externalCocktails) {
      loadCocktails();
    }
  }, [loadCocktails, externalCocktails]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        <span className="ml-3 text-gray-600">Cargando cócteles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={externalCocktails ? undefined : loadCocktails}
          className="btn-secondary px-4 py-2 rounded-lg"
          disabled={!!externalCocktails}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!cocktails || cocktails.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
        {!externalCocktails && (
          <p className="text-gray-400 text-sm mt-2">Crea tu primer cóctel para comenzar</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {cocktails.map(coctel => (
        <CoctelCard key={coctel.id} coctel={coctel} />
      ))}
    </div>
  );
}

export default CoctelGrid;
