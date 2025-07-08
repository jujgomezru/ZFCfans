import { useState } from 'react';
import {
  AlertIcon,
  BackIcon,
  ChecklistIcon,
  ForwardIcon,
  PlusIcon,
  SearchIcon,
} from '../icons/Icons';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');

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
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 transition-shadow"
          />
        </div>
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
