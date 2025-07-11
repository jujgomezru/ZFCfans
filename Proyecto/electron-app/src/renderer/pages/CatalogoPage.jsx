import CoctelGrid from '../components/cocteles/CoctelGrid';
import FilterDropdown from '../components/common/FilterDropdown';

function CatalogoPage() {
  // Opciones para los filtros
  const tipoLicorOptions = [
    { value: 'whisky', label: 'Whisky' },
    { value: 'vodka', label: 'Vodka' },
    { value: 'ron', label: 'Ron' },
    { value: 'tequila', label: 'Tequila' },
    { value: 'gin', label: 'Gin' },
  ];

  const dificultadOptions = [
    { value: 'facil', label: 'Fácil' },
    { value: 'medio', label: 'Medio' },
    { value: 'dificil', label: 'Difícil' },
  ];

  const categoriaOptions = [
    { value: 'aperitivo', label: 'Aperitivo' },
    { value: 'digestivo', label: 'Digestivo' },
    { value: 'dulce', label: 'Dulce' },
    { value: 'tropical', label: 'Tropical' },
  ];

  const handleFilterChange = (filterType, value) => {
    // Aquí implementarías la lógica de filtrado
    console.log(`${filterType} changed to:`, value);
  };

  return (
    <>
      {/* Header with title and filters */}
      <div className="sticky top-0 z-10 bg-[#FDFBF8] flex items-center justify-between mb-4 p-8 border-b border-gray-200/30">
        <h2 className="text-4xl font-bold text-gray-800">Catálogo</h2>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-4">
          <FilterDropdown
            placeholder="Tipo de licor"
            options={tipoLicorOptions}
            onChange={value => handleFilterChange('tipoLicor', value)}
          />

          <FilterDropdown
            placeholder="Dificultad"
            options={dificultadOptions}
            onChange={value => handleFilterChange('dificultad', value)}
          />

          <FilterDropdown
            placeholder="Categoría"
            options={categoriaOptions}
            onChange={value => handleFilterChange('categoria', value)}
          />
        </div>
      </div>

      {/* Cocktail cards grid */}
      <div className="p-8">
        <CoctelGrid />
      </div>
    </>
  );
}

export default CatalogoPage;
