import CoctelCard from './CoctelCard';

// Datos mock temporales (luego conectaremos con la DB)
const mockCocteles = [
  {
    id: 1,
    nombre: 'Aperol Spritz',
    categoria: 'aperitivo',
    imagen:
      'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/3A602C62-7F02-4773-ACB2-7603622A3A19/Derivates/5133B835-49A1-4C2C-80EC-74E01842249C.jpg',
  },
  {
    id: 2,
    nombre: 'Piña Colada',
    categoria: 'dulce',
    imagen:
      'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/A9467000-4182-4A69-802E-6A36234604C1/Derivates/9cca3d9b-727b-4d23-b633-71dcd23125da.jpg',
  },
  {
    id: 3,
    nombre: 'Manhattan',
    categoria: 'digestivo',
    imagen: 'https://th.bing.com/th/id/OIP.vYIymbjbJdADafbswXH__gAAAA?rs=1&pid=ImgDetMain',
  },
];

function CoctelGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {mockCocteles.map(coctel => (
        <CoctelCard key={coctel.id} coctel={coctel} />
      ))}
    </div>
  );
}

export default CoctelGrid;
