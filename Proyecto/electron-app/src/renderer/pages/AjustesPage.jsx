import { SettingsIcon } from '../components/icons/Icons';

function AjustesPage() {
  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FDFBF8] flex items-center justify-between mb-4 p-8 border-b border-gray-200/30">
        <h2 className="text-4xl font-bold text-gray-800">Ajustes</h2>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <SettingsIcon className="w-12 h-12 text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Configuración</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Personaliza la aplicación según tus preferencias y necesidades.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-gray-800 font-medium">🚧 Sección en construcción</p>
            <p className="text-gray-700 text-sm mt-1">
              Próximamente podrás configurar temas, unidades de medida y más.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AjustesPage;
