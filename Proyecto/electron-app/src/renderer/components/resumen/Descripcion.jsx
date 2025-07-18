const Descripcion = ({ name, image, difficulty, preparationTime, glassType }) => {
  const cocktailName = name || '';
  const imageSrc =
    image || `https://placehold.co/192x192/E2E8F0/4A5568?text=${encodeURIComponent(cocktailName)}`;

  return (
    <div className="p-8 grid md:grid-cols-2 gap-6">
      <div className="w-48 h-48 mb-4">
        <img
          src={imageSrc}
          alt={cocktailName}
          className="w-full h-full object-cover rounded-lg shadow"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">{cocktailName}</h3>
        {difficulty !== null && <p className="text-gray-600 mb-2">Dificultad: {difficulty}</p>}
        {preparationTime !== null && (
          <p className="text-gray-600 mb-2">Tiempo estimado: {preparationTime} min</p>
        )}
        {glassType && <p className="text-gray-600">Copa: {glassType.replace('_', ' ')}</p>}
      </div>
    </div>
  );
};

export default Descripcion;
