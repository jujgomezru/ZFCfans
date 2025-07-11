import {
  AjustesPage,
  CatalogoPage,
  ConsumoResponsablePage,
  CrearPage,
  FavoritosPage,
  HistorialPage,
  ManualPage,
  PreparacionPage,
  UsuarioPage,
} from '../../pages';
import { useNavigation } from '../../context/NavigationContext';
import Footer from './Footer';

function MainContent() {
  const { currentPage } = useNavigation();

  const renderPage = () => {
    switch (currentPage) {
      case 'catalogo':
        return <CatalogoPage />;
      case 'favoritos':
        return <FavoritosPage />;
      case 'crear':
        return <CrearPage />;
      case 'manual':
        return <ManualPage />;
      case 'historial':
        return <HistorialPage />;
      case 'ajustes':
        return <AjustesPage />;
      case 'consumo-responsable':
        return <ConsumoResponsablePage />;
      case 'preparacion':
        return <PreparacionPage />;
      case 'usuario':
        return <UsuarioPage />;
      default:
        return <CatalogoPage />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {renderPage()}

      {/* Content footer */}
      <Footer />
    </div>
  );
}

export default MainContent;
