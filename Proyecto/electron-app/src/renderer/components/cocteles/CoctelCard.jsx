function CoctelCard({ coctel }) {
  const { nombre, imagen, categoria } = coctel;

  const getCategoryStyle = categoria => {
    switch (categoria?.toLowerCase()) {
      case 'aperitivo':
        return 'bg-orange-100 text-orange-700';
      case 'digestivo':
        return 'bg-red-100 text-red-800';
      case 'dulce':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col items-center text-center">
      {/* Image container */}
      <div className="w-48 h-48 mb-4">
        <img
          src={imagen || 'https://placehold.co/192x192/E2E8F0/4A5568?text=Cóctel'}
          alt={nombre}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Cocktail name */}
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{nombre}</h3>

      {/* Category tag */}
      <span
        className={`inline-block text-sm font-semibold px-3 py-1 rounded-full mb-6 ${getCategoryStyle(categoria)}`}
      >
        {categoria || 'sin categoría'}
      </span>

      {/* Action button */}
      <button className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors">
        Ver detalles
      </button>
    </div>
  );
}

export default CoctelCard;
