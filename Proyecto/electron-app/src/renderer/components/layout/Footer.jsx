import { useNavigation } from '../../context/NavigationContext';

function Footer() {
  const { navigateTo } = useNavigation();

  return (
    <footer className="flex-shrink-0 p-6 text-right">
      <button
        className="text-sm text-gray-500 hover:text-gray-800 hover:underline transition-colors"
        onClick={() => navigateTo('consumo-responsable')}
      >
        Política de consumo responsable
      </button>
    </footer>
  );
}

export default Footer;
