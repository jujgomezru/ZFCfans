const Ingredientes = ({ ingredients = [] }) => {
  if (!ingredients || ingredients.length === 0) {
    return (
      <div className="p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h4 className="text-2xl font-semibold mb-4">Ingredientes</h4>
        <p className="text-gray-500 text-center">No hay ingredientes disponibles</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h4 className="text-2xl font-semibold mb-6">Ingredientes</h4>
      <div className="space-y-4">
        {ingredients.map(ingredient => (
          <div
            key={`${ingredient.id_ingredient || ingredient.id}-${ingredient.order_index || Math.random()}`}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <span className="text-gray-800 font-medium">
                {ingredient.ingredient_name || ingredient.nombre || ingredient.name}
              </span>
              {ingredient.preparation_note && (
                <p className="text-sm text-gray-600 mt-1">{ingredient.preparation_note}</p>
              )}
            </div>
            <div className="text-right">
              <span className="text-gray-700 font-semibold">
                {ingredient.quantity || ingredient.cantidad} {ingredient.unit || ingredient.unidad}
              </span>
              {ingredient.is_optional === 1 && (
                <p className="text-xs text-gray-500 mt-1">Opcional</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ingredientes;
