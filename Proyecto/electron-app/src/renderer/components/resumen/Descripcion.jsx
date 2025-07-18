const Descripcion = ({ name, difficulty, preparationTime, glassType, imgUrl }) => (
  <div className="p-8 grid md:grid-cols-2 gap-6">
    <div>
      <img
        src={imgUrl || 'https://placehold.co/384x384/E2E8F0/4A5568?text=Imagen'}
        alt={name}
        className="w-48 h-48 object-cover rounded-lg shadow"
      />
    </div>
    <div className="flex flex-col justify-center">
      <h3 className="text-3xl font-bold text-gray-800 mb-4">{name}</h3>
      <p className="text-gray-600 mb-2">Dificultad: {difficulty}</p>
      <p className="text-gray-600 mb-2">Tiempo estimado: {preparationTime || '-'} min</p>
      <p className="text-gray-600">Copa: {glassType?.replace('_', ' ') || '-'}</p>
    </div>
  </div>
);

export default Descripcion;
