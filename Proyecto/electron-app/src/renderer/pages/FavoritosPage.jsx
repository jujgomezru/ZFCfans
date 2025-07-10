import { StarIcon } from '../components/icons/Icons';

function FavoritosPage() {
  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FDFBF8] flex items-center justify-between mb-4 p-8 border-b border-gray-200/30">
        <h2 className="text-4xl font-bold text-gray-800">Favoritos</h2>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <StarIcon className="w-12 h-12 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Cócteles Favoritos</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Aquí encontrarás todos los cócteles que has marcado como favoritos.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-orange-800 font-medium">🚧 Sección en construcción</p>
            <p className="text-orange-700 text-sm mt-1">
              Próximamente podrás guardar y gestionar tus cócteles favoritos.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default FavoritosPage;
