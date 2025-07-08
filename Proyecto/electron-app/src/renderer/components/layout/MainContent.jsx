import CoctelGrid from '../cocteles/CoctelGrid';
import { ChevronDownIcon } from '../icons/Icons';

function MainContent() {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Header with title and filters */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Catálogo</h2>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-8 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 transition-shadow">
              <option>Tipo de licor</option>
            </select>
            <ChevronDownIcon className="w-5 h-5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-8 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 transition-shadow">
              <option>Dificultad</option>
            </select>
            <ChevronDownIcon className="w-5 h-5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-8 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 transition-shadow">
              <option>Categoría</option>
            </select>
            <ChevronDownIcon className="w-5 h-5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Cocktail cards grid */}
      <CoctelGrid />

      {/* Content footer */}
      <footer className="flex-shrink-0 p-6 text-right">
        <a
          href="#"
          className="text-sm text-gray-500 hover:text-gray-800 hover:underline transition-colors"
        >
          Política de consumo responsable
        </a>
      </footer>
    </div>
  );
}

export default MainContent;
