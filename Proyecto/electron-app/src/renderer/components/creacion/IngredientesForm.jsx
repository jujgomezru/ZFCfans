import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

function IngredientesForm({ data, onChange }) {
  const availableIngredients = useMemo(
    () => [
      // Licores base
      'Vodka',
      'Ron blanco',
      'Ron dorado',
      'Ginebra',
      'Tequila',
      'Whisky',
      'Bourbon',
      'Brandy',
      'Cognac',
      'Rum oscuro',

      // Licores y cordiales
      'Triple Sec',
      'Cointreau',
      'Grand Marnier',
      'Amaretto',
      'Kahlúa',
      "Bailey's",
      'Sambuca',
      'Limoncello',
      'Frangelico',
      'Midori',

      // Vermuts y aperitivos
      'Vermut rojo',
      'Vermut blanco',
      'Campari',
      'Aperol',
      'Cynar',

      // Mixers y refrescos
      'Agua tónica',
      'Agua mineral',
      'Ginger ale',
      'Ginger beer',
      'Club soda',
      'Coca Cola',
      '7UP',
      'Agua',
      'Jugo de arándano',
      'Red Bull',

      // Jugos y néctares
      'Jugo de limón',
      'Jugo de lima',
      'Jugo de naranja',
      'Jugo de piña',
      'Jugo de tomate',
      'Jugo de manzana',
      'Jugo de uva',
      'Néctar de durazno',

      // Jarabes y edulcorantes
      'Jarabe simple',
      'Jarabe de granadina',
      'Jarabe de azúcar morena',
      'Miel',
      'Azúcar',
      'Stevia',
      'Jarabe de vainilla',
      'Jarabe de canela',

      // Lácteos y cremas
      'Crema de leche',
      'Leche',
      'Leche de coco',
      'Crema irlandesa',
      'Yogurt natural',
      'Helado de vainilla',

      // Especias y hierbas
      'Canela en polvo',
      'Nuez moscada',
      'Menta fresca',
      'Albahaca fresca',
      'Romero',
      'Tomillo',
      'Jengibre',
      'Cardamomo',

      // Frutas
      'Fresa',
      'Frambuesa',
      'Mora',
      'Arándanos',
      'Mango',
      'Maracuyá',
      'Durazno',
      'Pera',
      'Manzana',
      'Sandía',
      'Kiwi',
      'Piña',

      // Condimentos y otros
      'Sal',
      'Pimienta negra',
      'Salsa Worcestershire',
      'Salsa Tabasco',
      'Aceite de oliva',
      'Vinagre balsámico',
      'Hielo',
    ],
    [],
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const ingredients = useMemo(() => data.ingredients || [], [data.ingredients]);

  const filteredIngredients = useMemo(() => {
    if (!searchTerm) {
      return [];
    }
    return availableIngredients
      .filter(
        ingredient =>
          ingredient.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !ingredients.some(existing => existing.name === ingredient),
      )
      .slice(0, 8);
  }, [searchTerm, availableIngredients, ingredients]);

  const handleAddIngredient = useCallback(
    ingredientName => {
      const newIngredient = {
        name: ingredientName,
        quantity: '',
        unit: 'ml',
        notes: '',
      };

      const newIngredients = [...ingredients, newIngredient];
      onChange({ ingredients: newIngredients });
      setSearchTerm('');
      setShowSuggestions(false);
    },
    [ingredients, onChange],
  );

  const handleUpdateIngredient = useCallback(
    (index, field, value) => {
      const newIngredients = ingredients.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient,
      );
      onChange({ ingredients: newIngredients });
    },
    [ingredients, onChange],
  );

  const handleRemoveIngredient = useCallback(
    index => {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      onChange({ ingredients: newIngredients });
    },
    [ingredients, onChange],
  );

  const unitOptions = useMemo(
    () => [
      { value: 'ml', label: 'ml' },
      { value: 'oz', label: 'oz' },
      { value: 'cl', label: 'cl' },
      { value: 'cups', label: 'tazas' },
      { value: 'tbsp', label: 'cucharadas' },
      { value: 'tsp', label: 'cucharaditas' },
      { value: 'dash', label: 'gotas' },
      { value: 'splash', label: 'chorrito' },
      { value: 'pinch', label: 'pizca' },
      { value: 'slice', label: 'rodajas' },
      { value: 'leaves', label: 'hojas' },
      { value: 'pieces', label: 'piezas' },
      { value: 'to_taste', label: 'al gusto' },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ingredientes</h2>
        <p className="text-gray-600">
          Añade todos los ingredientes necesarios con sus cantidades exactas
        </p>
      </div>

      {/* Buscador de ingredientes */}
      <div className="relative">
        <label htmlFor="ingredient-search" className="block text-sm font-medium text-gray-700 mb-2">
          Buscar ingrediente
        </label>
        <input
          type="text"
          id="ingredient-search"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Escribe para buscar ingredientes..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-transparent"
        />

        {/* Sugerencias */}
        {showSuggestions && filteredIngredients.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredIngredients.map(ingredient => (
              <button
                key={ingredient}
                type="button"
                onClick={() => handleAddIngredient(ingredient)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
              >
                {ingredient}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lista de ingredientes añadidos */}
      {ingredients.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Ingredientes añadidos ({ingredients.length})
          </h3>

          <div className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <div
                key={`ingredient-${ingredient.name}-${Date.now()}-${Math.random()}`}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  {/* Nombre del ingrediente */}
                  <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Ingrediente
                    </label>
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={e => handleUpdateIngredient(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-300 focus:border-transparent"
                    />
                  </div>

                  {/* Cantidad */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Cantidad</label>
                    <input
                      type="text"
                      value={ingredient.quantity}
                      onChange={e => handleUpdateIngredient(index, 'quantity', e.target.value)}
                      placeholder="Ej: 50, 1/2"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-300 focus:border-transparent"
                    />
                  </div>

                  {/* Unidad */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Unidad</label>
                    <select
                      value={ingredient.unit}
                      onChange={e => handleUpdateIngredient(index, 'unit', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-300 focus:border-transparent"
                    >
                      {unitOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notas */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Notas</label>
                    <input
                      type="text"
                      value={ingredient.notes}
                      onChange={e => handleUpdateIngredient(index, 'notes', e.target.value)}
                      placeholder="Opcional"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-300 focus:border-transparent"
                    />
                  </div>

                  {/* Botón eliminar */}
                  <div className="md:col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="w-full px-2 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar ingrediente"
                    >
                      <svg
                        className="w-4 h-4 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay ingredientes */}
      {ingredients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <p>No has añadido ningún ingrediente aún</p>
          <p className="text-sm">Usa el buscador de arriba para añadir ingredientes</p>
        </div>
      )}

      {/* Consejos */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Consejos</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Ordena los ingredientes por importancia (licores base primero)</li>
          <li>• Especifica cantidades exactas para mejores resultados</li>
          <li>
            • Usa las notas para aclaraciones (ej: &quot;bien frío&quot;, &quot;recién
            exprimido&quot;)
          </li>
        </ul>
      </div>
    </div>
  );
}

IngredientesForm.propTypes = {
  data: PropTypes.shape({
    ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.string,
        unit: PropTypes.string,
        notes: PropTypes.string,
      }),
    ),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default IngredientesForm;
