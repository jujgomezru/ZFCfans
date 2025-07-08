import { useState } from 'react';
import { SearchIcon } from '../icons/Icons';

function SearchBar({ placeholder = 'Search...', onSearch, className = '' }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = e => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  return (
    <div className={`relative ${className}`}>
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </span>
      <input
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 transition-shadow"
      />
    </div>
  );
}

export default SearchBar;
