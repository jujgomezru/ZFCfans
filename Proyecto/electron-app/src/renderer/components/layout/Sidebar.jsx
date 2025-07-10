import {
  BookIcon,
  CatalogIcon,
  ClockIcon,
  CreateIcon,
  LogoIcon,
  SettingsIcon,
  StarIcon,
} from '../icons/Icons';
import { useNavigation } from '../../context/NavigationContext';

function Sidebar() {
  const { currentPage, navigateTo } = useNavigation();

  const menuItems = [
    { id: 'catalogo', name: 'Catálogo', icon: CatalogIcon },
    { id: 'favoritos', name: 'Favoritos', icon: StarIcon },
    { id: 'crear', name: 'Crear cóctel', icon: CreateIcon },
    { id: 'manual', name: 'Manual', icon: BookIcon },
    { id: 'historial', name: 'Historial', icon: ClockIcon },
    { id: 'ajustes', name: 'Ajustes', icon: SettingsIcon },
  ];

  return (
    <aside className="w-1/4 max-w-[260px] p-6 flex flex-col border-r border-gray-200/80">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 text-[#E58D4B]">
          <LogoIcon className="w-full h-full" />
        </div>
        <h1 className="font-bold text-2xl text-gray-800">ZFCocteles</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map(item => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-orange-100/60 text-[#E58D4B] font-semibold'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="pt-6">
        <p className="text-sm text-gray-500">© ZFC Fans</p>
      </div>
    </aside>
  );
}

export default Sidebar;
