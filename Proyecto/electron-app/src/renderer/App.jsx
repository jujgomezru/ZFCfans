import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MainContent from './components/layout/MainContent';
import { NavigationProvider } from './context/NavigationContext';

function App() {
  return (
    <NavigationProvider>
      <div className="h-screen w-full flex items-center justify-center p-4 bg-[#F9F6F2] antialiased text-gray-800">
        {/* Main container with the window-like appearance */}
        <div className="bg-[#FDFBF8] w-full max-w-7xl h-full max-h-[900px] rounded-2xl shadow-lg flex border border-gray-200/50">
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col">
            <Header />
            <MainContent />
          </main>
        </div>
      </div>
    </NavigationProvider>
  );
}

export default App;
