import { ClockIcon } from '../components/icons/Icons';

function HistorialPage() {
  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FDFBF8] flex items-center justify-between mb-4 p-8 border-b border-gray-200/30">
        <h2 className="text-4xl font-bold text-gray-800">Historial</h2>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
            <ClockIcon className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Historial de Cócteles</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Revisa el historial de cócteles que has consultado y preparado anteriormente.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-purple-800 font-medium">🚧 Sección en construcción</p>
            <p className="text-purple-700 text-sm mt-1">
              Próximamente podrás ver el historial de tu actividad.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default HistorialPage;
