import { PlusIcon } from '../components/icons/Icons';

function CrearPage() {
  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FDFBF8] flex items-center justify-between mb-4 p-8 border-b border-gray-200/30">
        <h2 className="text-4xl font-bold text-gray-800">Crear Cóctel</h2>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <PlusIcon className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Crear Nuevo Cóctel</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Utiliza el constructor de cócteles para crear tus propias recetas personalizadas.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-green-800 font-medium">🚧 Sección en construcción</p>
            <p className="text-green-700 text-sm mt-1">
              Próximamente podrás crear cócteles usando el patrón Builder.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CrearPage;
