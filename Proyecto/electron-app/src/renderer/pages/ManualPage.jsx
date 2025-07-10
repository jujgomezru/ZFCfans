import { BookIcon } from '../components/icons/Icons';

function ManualPage() {
  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FDFBF8] flex items-center justify-between mb-4 p-8 border-b border-gray-200/30">
        <h2 className="text-4xl font-bold text-gray-800">Manual</h2>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <BookIcon className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Manual de Usuario</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Guías y documentación para sacar el máximo provecho de ZFCocteles.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-blue-800 font-medium">🚧 Sección en construcción</p>
            <p className="text-blue-700 text-sm mt-1">
              Próximamente encontrarás tutoriales y guías de uso.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManualPage;
