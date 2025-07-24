import { useCallback, useEffect, useState } from 'react';
import { CheckCircleIcon, CloseIcon, TagIcon } from '../icons/Icons';
import CategoryController from '../../controllers/CategoryController';

function CategoryModal({ isOpen, onClose, onConfirm, cocktailId, cocktailName }) {
  const [categories, setCategories] = useState([]);
  const [cocktailCategories, setCocktailCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar todas las categorías y las categorías del cóctel en paralelo
      const [allCategories, currentCategories] = await Promise.all([
        CategoryController.getAll(),
        CategoryController.getCocktailCategories(cocktailId),
      ]);

      setCategories(allCategories || []);
      setCocktailCategories(currentCategories || []);

      // Inicializar categorías seleccionadas con las actuales del cóctel
      const currentIds = new Set((currentCategories || []).map(cat => cat.id));
      setSelectedCategories(currentIds);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cocktailId]);

  // Cargar categorías y categorías del cóctel al abrir el modal
  useEffect(() => {
    if (isOpen && cocktailId) {
      loadData();
    }
  }, [isOpen, cocktailId, loadData]);

  const handleCategoryToggle = categoryId => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      // Determinar categorías a agregar y remover
      const currentIds = new Set(cocktailCategories.map(cat => cat.id));
      const selectedIds = selectedCategories;

      const toAdd = [...selectedIds].filter(id => !currentIds.has(id));
      const toRemove = [...currentIds].filter(id => !selectedIds.has(id));

      // Ejecutar cambios
      const promises = [
        ...toAdd.map(categoryId =>
          CategoryController.addCocktailToCategory(cocktailId, categoryId),
        ),
        ...toRemove.map(categoryId =>
          CategoryController.removeCocktailFromCategory(cocktailId, categoryId),
        ),
      ];

      await Promise.all(promises);

      // Llamar al callback de confirmación
      if (onConfirm) {
        onConfirm(selectedIds);
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar selección original
    const originalIds = new Set(cocktailCategories.map(cat => cat.id));
    setSelectedCategories(originalIds);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <TagIcon className="w-6 h-6 text-orange-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gestionar Categorías</h3>
              <p className="text-sm text-gray-500">{cocktailName}</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {!loading && categories.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay categorías disponibles</p>
            </div>
          )}

          {!loading && categories.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {categories.map(category => (
                <label
                  key={category.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{category.name}</span>
                      {category.is_system === 1 && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          Sistema
                        </span>
                      )}
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    )}
                  </div>
                  {selectedCategories.has(category.id) && (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;
