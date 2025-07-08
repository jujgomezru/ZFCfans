import { AlertIcon, BackIcon, ChecklistIcon, ForwardIcon, PlusIcon } from '../icons/Icons';
import SearchBar from '../ui/SearchBar';

function Header() {
  const handleSearch = searchTerm => {
    console.log('Searching for:', searchTerm);
    // Aquí implementarías la lógica de búsqueda
  };

  return (
    <header className="flex-shrink-0 h-[76px] flex items-center justify-between p-4 px-6 border-b border-gray-200/80">
      {/* Left side: nav arrows */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 text-gray-500">
          <button className="hover:text-gray-700 transition-colors">
            <BackIcon />
          </button>
          <button className="hover:text-gray-700 transition-colors">
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
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
          <ChecklistIcon />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
          <PlusIcon />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-2" />
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
          <AlertIcon />
        </button>
        <button className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden hover:bg-gray-300 transition-colors">
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
