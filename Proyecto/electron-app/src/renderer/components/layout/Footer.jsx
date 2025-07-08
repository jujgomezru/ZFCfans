function Footer() {
  return (
    <footer className="flex-shrink-0 p-6 text-right">
      <a
        href="#"
        className="text-sm text-gray-500 hover:text-gray-800 hover:underline transition-colors"
        onClick={e => {
          e.preventDefault();
          // Aquí podrías abrir un modal o navegar a la página de políticas
          console.log('Abrir política de consumo responsable');
        }}
      >
        Política de consumo responsable
      </a>
    </footer>
  );
}

export default Footer;
