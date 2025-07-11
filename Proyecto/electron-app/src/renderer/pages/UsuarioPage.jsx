import {
  ChartBarIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UserIcon,
  UserProfileIcon,
} from '../components/icons/Icons';

function UsuarioPage() {
  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FDFBF8] flex items-center justify-between mb-4 p-8 border-b border-gray-200/30">
        <h2 className="text-4xl font-bold text-gray-800">Perfil de Usuario</h2>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-12 h-12 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Mi Perfil</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Gestiona tu información personal, preferencias y configuraciones de la aplicación.
          </p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-indigo-800 font-medium">🚧 Sección en construcción</p>
            <p className="text-indigo-700 text-sm mt-1">
              Próximamente podrás personalizar tu perfil y preferencias.
            </p>
          </div>
        </div>

        {/* Profile Features Preview */}
        <div className="max-w-4xl mx-auto mt-16">
          <h4 className="text-xl font-semibold text-gray-800 mb-8 text-center">
            Próximas Funcionalidades
          </h4>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <UserProfileIcon className="w-6 h-6 text-green-600" />
              </div>
              <h5 className="text-lg font-semibold text-gray-800 mb-3">Información Personal</h5>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• Nombre y avatar personalizado</li>
                <li>• Fecha de nacimiento y ubicación</li>
                <li>• Preferencias de sabores</li>
                <li>• Nivel de experiencia en coctelería</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ChartBarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h5 className="text-lg font-semibold text-gray-800 mb-3">Estadísticas</h5>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• Cócteles preparados</li>
                <li>• Recetas favoritas</li>
                <li>• Tiempo total de preparación</li>
                <li>• Logros desbloqueados</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <SettingsIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <h5 className="text-lg font-semibold text-gray-800 mb-3">Configuración</h5>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• Unidades de medida</li>
                <li>• Notificaciones</li>
                <li>• Tema de la aplicación</li>
                <li>• Idioma y región</li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-red-600" />
              </div>
              <h5 className="text-lg font-semibold text-gray-800 mb-3">Seguridad</h5>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• Contraseña y autenticación</li>
                <li>• Privacidad de datos</li>
                <li>• Respaldo de información</li>
                <li>• Control parental</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UsuarioPage;
