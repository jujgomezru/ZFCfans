import {
  CheckCircleIcon,
  ChecklistIcon,
  ClockIcon,
  CocktailShakerIcon,
} from '../components/icons/Icons';

function PreparacionPage() {
  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FDFBF8] flex items-center justify-between mb-4 p-8 border-b border-gray-200/30">
        <h2 className="text-4xl font-bold text-gray-800">Preparar cóctel</h2>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CocktailShakerIcon className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Preparar cóctel</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Sigue paso a paso las instrucciones para preparar tu cóctel perfecto.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-green-800 font-medium">🚧 Sección en construcción</p>
            <p className="text-green-700 text-sm mt-1">
              Próximamente podrás seguir recetas paso a paso con temporizadores y checklists.
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="max-w-4xl mx-auto mt-16">
          <h4 className="text-xl font-semibold text-gray-800 mb-8 text-center">
            Próximas Funcionalidades
          </h4>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ChecklistIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Lista de Verificación</h5>
              <p className="text-gray-600 text-sm">
                Checklist interactivo para asegurar que tengas todos los ingredientes y utensilios.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <ClockIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Temporizadores</h5>
              <p className="text-gray-600 text-sm">
                Temporizadores integrados para cada paso que requiera tiempo específico.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircleIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Guía Paso a Paso</h5>
              <p className="text-gray-600 text-sm">
                Instrucciones detalladas con imágenes y videos para cada técnica de preparación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PreparacionPage;
