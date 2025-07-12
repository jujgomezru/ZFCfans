import { useEffect, useState } from 'react';
import CoctelCard from './CoctelCard';

function CoctelGrid() {
  const [cocteles, setCocteles] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const cargar = async () => {
      const res = await window.electronAPI.obtenerCocteles();
      if (res?.success) {
        setCocteles(res.data);
      } else {
        setError(res?.error || 'Error al cargar los cócteles');
      }
    };

    cargar();
  }, []);

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (cocteles.length === 0) {
    return <p className="text-gray-500">No hay cócteles disponibles.</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {cocteles.map(coctel => (
        <CoctelCard key={coctel.id} coctel={coctel} />
      ))}
    </div>
  );
}

export default CoctelGrid;
