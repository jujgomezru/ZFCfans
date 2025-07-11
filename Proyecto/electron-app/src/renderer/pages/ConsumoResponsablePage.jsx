import { ClockIcon, FoodIcon, ForbiddenIcon, WarningIcon } from '../components/icons/Icons';

function ConsumoResponsablePage() {
  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FDFBF8] flex items-center justify-between mb-4 p-8 border-b border-gray-200/30">
        <h2 className="text-4xl font-bold text-gray-800">Consumo Responsable</h2>
      </div>

      {/* Content */}
      <div className="p-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <WarningIcon className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Disfruta con Responsabilidad</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            El consumo de alcohol debe ser siempre responsable, moderado y consciente. Tu bienestar
            y el de quienes te rodean es lo más importante.
          </p>
        </div>

        {/* Guidelines Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Card 1 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <ClockIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Moderación</h4>
            <p className="text-gray-600">
              Respeta los límites recomendados: máximo 2 tragos por día para hombres y 1 para
              mujeres. Siempre deja días sin consumir alcohol.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <ForbiddenIcon className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Nunca Conduzcas</h4>
            <p className="text-gray-600">
              Si has consumido alcohol, utiliza transporte público, taxi o pide a alguien sobrio que
              conduzca. Tu vida y la de otros vale más que cualquier inconveniente.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <FoodIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Acompaña con Comida</h4>
            <p className="text-gray-600">
              Nunca bebas con el estómago vacío. Acompaña siempre con alimentos y mantente hidratado
              bebiendo agua entre tragos.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Respeta a Otros</h4>
            <p className="text-gray-600">
              Nunca presiones a alguien para que beba. Respeta las decisiones de quienes eligen no
              consumir alcohol o han decidido parar.
            </p>
          </div>
        </div>

        {/* Warning Section */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <WarningIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-red-800 mb-2">
                Contraindicaciones Importantes
              </h4>
              <ul className="text-red-700 space-y-1 text-sm">
                <li>
                  • <strong>Menores de edad:</strong> El consumo de alcohol está prohibido
                </li>
                <li>
                  • <strong>Embarazo y lactancia:</strong> Evita completamente el alcohol
                </li>
                <li>
                  • <strong>Medicamentos:</strong> Consulta con tu médico sobre interacciones
                </li>
                <li>
                  • <strong>Enfermedades:</strong> Si tienes problemas hepáticos, cardíacos o
                  adicciones, abstente
                </li>
                <li>
                  • <strong>Conducción:</strong> Tolerancia cero al volante
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-gray-700 text-sm leading-relaxed">
            <strong>ZFCocteles</strong> promueve exclusivamente el{' '}
            <strong>consumo responsable y moderado</strong> de alcohol entre adultos mayores de
            edad. Esta aplicación tiene fines educativos y de entretenimiento. El usuario es
            completamente responsable de sus decisiones de consumo.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Si necesitas ayuda con problemas de alcohol, contacta a profesionales de la salud o
            líneas de ayuda especializadas.
          </p>
        </div>
      </div>
    </>
  );
}

export default ConsumoResponsablePage;
