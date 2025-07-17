import { useEffect, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';

function ResumenInformativoPage() {
  const { params, navigateTo } = useNavigation();
  const { recipeId } = params;
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('▶️ recipeId:', recipeId);
    if (!recipeId) {
      return;
    }
    (async () => {
      try {
        const data = await window.electronAPI.obtenerRecetaCompleta(recipeId);
        if (data) {
          setRecipe(data);
        } else {
          setError('Receta no encontrada');
        }
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [recipeId]);

  const handleClose = () => {
    navigateTo('catalogo');
  };

  if (error) {
    return (
      <div className="p-8">
        <button
          onClick={handleClose}
          className="focus-ring p-2 rounded-full hover:bg-gray-200 text-gray-600"
        >
          ×
        </button>
        <p className="text-red-500 mt-4">Error: {error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="p-8">
        <button
          onClick={handleClose}
          className="focus-ring p-2 rounded-full hover:bg-gray-200 text-gray-600"
        >
          ×
        </button>
        <p className="text-gray-500 mt-4">Cargando...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header con título y botón de cierre */}
      <div className="sticky top-0 z-10 bg-[#FDFBF8] flex items-center justify-between mb-4 p-8 border-b border-gray-200/30">
        <h2 className="text-4xl font-bold text-gray-800">Resumen Informativo</h2>
        <button
          onClick={handleClose}
          className="focus-ring p-2 rounded-full hover:bg-gray-200 text-gray-600"
        >
          ×
        </button>
      </div>

      {/* Información general */}
      <div className="p-8 grid md:grid-cols-2 gap-6">
        <div>
          <img
            src={recipe.img_url || 'https://placehold.co/384x384/E2E8F0/4A5568?text=Imagen'}
            alt={recipe.cocktail_name}
            className="w-full rounded-lg shadow"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">{recipe.cocktail_name}</h3>
          <p className="text-gray-600 mb-2">Dificultad: {recipe.difficulty}</p>
          <p className="text-gray-600 mb-2">
            Tiempo estimado: {recipe.preparation_time || '-'} min
          </p>
          <p className="text-gray-600">Copa: {recipe.glass_type?.replace('_', ' ') || '-'}</p>
        </div>
      </div>

      {/* Paso a paso */}
      <div className="p-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h4 className="text-2xl font-semibold mb-4">Preparación</h4>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            {recipe.steps.map(step => (
              <li key={step.id}>{step.instruction}</li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}

export default ResumenInformativoPage;
