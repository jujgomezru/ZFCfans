import { AlertIcon, BellIcon, CheckCircleIcon, WarningIcon } from '../components/icons/Icons';

function NotificacionesPage() {
  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FDFBF8] flex items-center justify-between mb-4 p-8 border-b border-gray-200/30">
        <h2 className="text-4xl font-bold text-gray-800">Notificaciones</h2>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <BellIcon className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Centro de Notificaciones</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Mantente al día con advertencias, logs del sistema y actualizaciones importantes.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-blue-800 font-medium">🚧 Sección en construcción</p>
            <p className="text-blue-700 text-sm mt-1">
              Próximamente podrás ver notificaciones del sistema, logs de errores y alertas.
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="max-w-4xl mx-auto mt-16">
          <h4 className="text-xl font-semibold text-gray-800 mb-8 text-center">
            Tipos de Notificaciones
          </h4>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <WarningIcon className="w-6 h-6 text-red-600" />
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Advertencias</h5>
              <p className="text-gray-600 text-sm">
                Alertas sobre ingredientes faltantes, combinaciones peligrosas o problemas de
                inventario.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <AlertIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Logs del Sistema</h5>
              <p className="text-gray-600 text-sm">
                Registro de actividades, errores del sistema y seguimiento de operaciones.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">Actualizaciones</h5>
              <p className="text-gray-600 text-sm">
                Nuevas funcionalidades, recetas añadidas y mejoras de la aplicación.
              </p>
            </div>
          </div>

          {/* Notification Examples */}
          <div className="mt-12">
            <h4 className="text-xl font-semibold text-gray-800 mb-6">Ejemplo de Notificaciones</h4>
            <div className="space-y-4">
              {/* Warning notification */}
              <div className="bg-white border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                <div className="flex items-start">
                  <WarningIcon className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
                  <div>
                    <h6 className="font-semibold text-gray-800">Ingrediente no disponible</h6>
                    <p className="text-gray-600 text-sm">
                      El ron añejo no está disponible para el cóctel &quot;Old Fashioned&quot;
                    </p>
                    <span className="text-xs text-gray-400">Hace 2 minutos</span>
                  </div>
                </div>
              </div>

              {/* Info notification */}
              <div className="bg-white border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
                <div className="flex items-start">
                  <AlertIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <h6 className="font-semibold text-gray-800">Nueva receta añadida</h6>
                    <p className="text-gray-600 text-sm">
                      Se ha agregado &quot;Piña Colada Tropical&quot; a tu catálogo
                    </p>
                    <span className="text-xs text-gray-400">Hace 1 hora</span>
                  </div>
                </div>
              </div>

              {/* Success notification */}
              <div className="bg-white border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm">
                <div className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3" />
                  <div>
                    <h6 className="font-semibold text-gray-800">Cóctel preparado exitosamente</h6>
                    <p className="text-gray-600 text-sm">
                      Has completado la preparación de &quot;Mojito Clásico&quot;
                    </p>
                    <span className="text-xs text-gray-400">Hace 3 horas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotificacionesPage;
