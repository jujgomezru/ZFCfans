import { BackIcon, BellIcon, CocktailShakerIcon, ForwardIcon } from '../icons/Icons';
import SearchBar from '../common/SearchBar';
import { useNavigation } from '../../context/NavigationContext';

function Header() {
  const { navigateTo, navigateNext, navigatePrevious, getCurrentPageInfo } = useNavigation();
  const pageInfo = getCurrentPageInfo();

  const handleSearch = _searchTerm => {
    // TODO: implementar lógica de búsqueda
  };

  return (
    <header className="flex-shrink-0 h-[76px] flex items-center justify-between p-4 px-6 border-b border-gray-200/80">
      {/* Left side: nav arrows */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 text-gray-500">
          <button
            title={`Página anterior: ${pageInfo.previousName}`}
            className="p-1 rounded-md hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
            onClick={navigatePrevious}
          >
            <BackIcon />
          </button>
          <button
            title={`Página siguiente: ${pageInfo.nextName}`}
            className="p-1 rounded-md hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
            onClick={navigateNext}
          >
            <ForwardIcon />
          </button>
        </div>
      </div>

      {/* Middle: Search bar */}
      <div className="flex-1 max-w-lg">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Right side: Action Icons */}
      <div className="flex items-center gap-3">
        <button
          title="Preparar cóctel"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          onClick={() => navigateTo('preparacion')}
        >
          <CocktailShakerIcon />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-2" />
        <button
          title="Notificaciones"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          onClick={() => navigateTo('notificaciones')}
        >
          <BellIcon />
        </button>
        <button
          title="Usuario"
          className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden hover:bg-gray-300 transition-colors"
          onClick={() => navigateTo('usuario')}
        >
          <img
            src="https://placehold.co/40x40/E2E8F0/4A5568?text=U"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}

export default Header;
