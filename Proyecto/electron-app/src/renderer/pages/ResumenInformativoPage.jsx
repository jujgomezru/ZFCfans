import { useEffect, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import Descripcion from '../components/resumen/Descripcion';
import Instructivo from '../components/resumen/Instructivo';

function ResumenInformativoPage() {
  const { params, navigateTo } = useNavigation();
  const { recipeId, nombre: coctelNombre, imagen: coctelImagen } = params;
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  const handleClose = () => navigateTo('catalogo');

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
      <div className="sticky top-0 z-10 bg-[#FDFBF8] flex items-center justify-between mb-4 p-8 border-b border-gray-200/30">
        <h2 className="text-4xl font-bold text-gray-800">Resumen Informativo</h2>
        <button
          onClick={handleClose}
          className="focus-ring p-2 rounded-full hover:bg-gray-200 text-gray-600"
        >
          ×
        </button>
      </div>
      {/* Pasa nombre e imagen desde params */}
      <Descripcion
        name={coctelNombre}
        image={coctelImagen}
        difficulty={recipe.difficulty}
        preparationTime={recipe.preparation_time}
        glassType={recipe.glass_type}
      />
      <Instructivo steps={recipe.steps} />
    </>
  );
}

export default ResumenInformativoPage;
