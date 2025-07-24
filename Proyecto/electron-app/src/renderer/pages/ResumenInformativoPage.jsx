import { useNavigation } from '../context/NavigationContext';
import { useRecipe } from '../hooks/useRecipe';
import Descripcion from '../components/resumen/Descripcion';
import Instructivo from '../components/resumen/Instructivo';

function ResumenInformativoPage() {
  const { params, navigateTo } = useNavigation();
  const { recipeId, nombre: coctelNombre, imagen: coctelImagen } = params;
  
  // Usar el hook personalizado para gestión de recetas
  const { recipe, loading, error } = useRecipe(recipeId);

  const handleClose = () => navigateTo('catalogo');

  if (loading) {
    return (
      <div className="p-8">
        <button
          onClick={handleClose}
          className="focus-ring p-2 rounded-full hover:bg-gray-200 text-gray-600"
        >
          ×
        </button>
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
        </div>
        <p className="text-center mt-4 text-gray-600">Cargando receta...</p>
      </div>
    );
  }

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
        <p className="text-gray-500 mt-4">No se encontró la receta solicitada</p>
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
      {/* Pasa nombre e imagen desde params, datos de receta desde hook */}
      <Descripcion
        name={coctelNombre || recipe.name}
        image={coctelImagen || recipe.img_url}
        difficulty={recipe.difficulty}
        preparationTime={recipe.preparation_time}
        glassType={recipe.glass_type}
      />
      <Instructivo steps={recipe.pasos || recipe.steps || []} />
    </>
  );
}

export default ResumenInformativoPage;
