import { ArchiveIcon, PlusIcon, StarIcon } from '../components/icons/Icons';

function CategoriasPage() {
  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FDFBF8] flex items-center justify-between mb-4 p-8 border-b border-gray-200/30">
        <h2 className="text-4xl font-bold text-gray-800">Categorías</h2>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
            <ArchiveIcon className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Gestión de Categorías</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Organiza tus cócteles en categorías personalizadas y gestiona tus favoritos.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-purple-800 font-medium">🚧 Sección en construcción</p>
            <p className="text-purple-700 text-sm mt-1">
              Próximamente podrás crear, editar y gestionar categorías personalizadas.
            </p>
          </div>
        </div>

        {/* Categories Preview */}
        <div className="max-w-4xl mx-auto mt-16">
          <h4 className="text-xl font-semibold text-gray-800 mb-8 text-center">
            Tipos de Categorías
          </h4>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Favoritos Category */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <StarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <h5 className="text-lg font-semibold text-gray-800 mb-3">Favoritos</h5>
              <p className="text-gray-600 text-sm mb-4">
                Categoría especial que contiene todos los cócteles que has marcado como favoritos.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Marcado automático con estrella</li>
                <li>• Acceso rápido a recetas preferidas</li>
                <li>• Sincronización con otras categorías</li>
              </ul>
            </div>

            {/* Custom Categories */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <PlusIcon className="w-6 h-6 text-green-600" />
              </div>
              <h5 className="text-lg font-semibold text-gray-800 mb-3">
                Categorías Personalizadas
              </h5>
              <p className="text-gray-600 text-sm mb-4">
                Crea tus propias categorías para organizar cócteles según tus criterios.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Crear categorías ilimitadas</li>
                <li>• Asignar colores personalizados</li>
                <li>• Filtrar y buscar por categoría</li>
                <li>• Estadísticas por categoría</li>
              </ul>
            </div>
          </div>

          {/* Example Categories */}
          <div className="mt-12">
            <h4 className="text-xl font-semibold text-gray-800 mb-6">Ejemplos de Categorías</h4>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Example category cards */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h6 className="font-semibold text-yellow-800">⭐ Favoritos</h6>
                  <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                    12 cócteles
                  </span>
                </div>
                <p className="text-yellow-700 text-sm">Mis cócteles preferidos</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h6 className="font-semibold text-blue-800">🏖️ Tropicales</h6>
                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                    8 cócteles
                  </span>
                </div>
                <p className="text-blue-700 text-sm">Cócteles refrescantes de verano</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h6 className="font-semibold text-red-800">🔥 Fuertes</h6>
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                    6 cócteles
                  </span>
                </div>
                <p className="text-red-700 text-sm">Alta graduación alcohólica</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h6 className="font-semibold text-green-800">🌿 Sin Alcohol</h6>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                    4 cócteles
                  </span>
                </div>
                <p className="text-green-700 text-sm">Mocktails y bebidas saludables</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h6 className="font-semibold text-purple-800">🎉 Para Fiestas</h6>
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                    10 cócteles
                  </span>
                </div>
                <p className="text-purple-700 text-sm">Perfectos para celebraciones</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h6 className="font-semibold text-orange-800">🍂 Clásicos</h6>
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">
                    15 cócteles
                  </span>
                </div>
                <p className="text-orange-700 text-sm">Recetas tradicionales y atemporales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoriasPage;
