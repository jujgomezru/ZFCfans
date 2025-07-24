import { ChevronDownIcon } from '../icons/Icons';

function FilterDropdown({ placeholder, options = [], value, onChange, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value || ''}
        onChange={e => onChange?.(e.target.value)}
        className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 transition-shadow cursor-pointer"
        style={{
          backgroundImage: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  );
}

export default FilterDropdown;
