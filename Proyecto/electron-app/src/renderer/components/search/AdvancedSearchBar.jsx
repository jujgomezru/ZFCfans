import { useCallback, useEffect, useRef, useState } from 'react';
import { CloseIcon, SearchIcon } from '../icons/Icons';

function AdvancedSearchBar({
  placeholder = 'Buscar cócteles, ingredientes o categorías...',
  onSearch,
  onSuggestionSelect,
  suggestions = [],
  loading = false,
  className = '',
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Manejar cambios en el input
  const handleInputChange = useCallback(
    e => {
      const value = e.target.value;
      setSearchTerm(value);
      setSelectedSuggestionIndex(-1);

      // Llamar callback de búsqueda con debounce implícito
      if (onSearch) {
        onSearch(value);
      }

      // Mostrar sugerencias si hay texto
      setShowSuggestions(value.length >= 2);
    },
    [onSearch],
  );

  // Manejar envío del formulario
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      setShowSuggestions(false);

      if (onSearch && searchTerm.trim()) {
        onSearch(searchTerm.trim(), true); // true indica búsqueda final
      }
    },
    [onSearch, searchTerm],
  );

  // Manejar selección de sugerencia
  const handleSuggestionClick = useCallback(
    suggestion => {
      setSearchTerm(suggestion.suggestion);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);

      if (onSuggestionSelect) {
        onSuggestionSelect(suggestion);
      }
    },
    [onSuggestionSelect],
  );

  // Limpiar búsqueda
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);

    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  // Manejar navegación con teclado
  const handleKeyDown = useCallback(
    e => {
      if (!showSuggestions || suggestions.length === 0) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedSuggestionIndex >= 0) {
            handleSuggestionClick(suggestions[selectedSuggestionIndex]);
          } else {
            handleSubmit(e);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
          break;
      }
    },
    [showSuggestions, suggestions, selectedSuggestionIndex, handleSuggestionClick, handleSubmit],
  );

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Obtener icono para el tipo de sugerencia
  const getSuggestionIcon = type => {
    switch (type) {
      case 'cocktail':
        return '🍸';
      case 'ingredient':
        return '🥄';
      case 'category':
        return '📋';
      default:
        return '🔍';
    }
  };

  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="block w-full pl-10 pr-12 py-3 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
            disabled={loading}
          />

          {/* Botón de limpiar */}
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          )}

          {loading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-orange-500" />
            </div>
          )}
        </div>

        {/* Lista de sugerencias */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map(suggestion => (
              <button
                key={`${suggestion.type}-${suggestion.suggestion}`}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                  suggestions.indexOf(suggestion) === selectedSuggestionIndex
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                <div>
                  <div className="font-medium">{suggestion.suggestion}</div>
                  {suggestion.type && (
                    <div className="text-xs text-gray-500 capitalize">
                      {suggestion.type === 'cocktail' && 'Cóctel'}
                      {suggestion.type === 'ingredient' && 'Ingrediente'}
                      {suggestion.type === 'category' && 'Categoría'}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Overlay para cerrar sugerencias en móvil */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40 bg-transparent sm:hidden"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}

export default AdvancedSearchBar;
