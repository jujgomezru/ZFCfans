import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

function ImagenForm({ data, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(data.image_url || null);

  const handleFileSelect = useCallback(
    file => {
      if (!file) {
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('La imagen es demasiado grande. El tamaño máximo es 5MB');
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onload = e => {
        const imageUrl = e.target.result;
        setPreview(imageUrl);
        onChange({
          image_url: imageUrl,
          image_file: file,
        });
      };
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const handleDrop = useCallback(
    e => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback(e => {
    e.preventDefault();
  }, []);

  const handleDragEnter = useCallback(e => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(e => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    e => {
      const file = e.target.files[0];
      handleFileSelect(file);
    },
    [handleFileSelect],
  );

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    onChange({
      image_url: null,
      image_file: null,
    });
  }, [onChange]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Imagen del Cóctel</h2>
        <p className="text-gray-600">
          Añade una imagen atractiva de tu cóctel (opcional pero recomendado)
        </p>
      </div>

      {/* Área de carga de imagen */}
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${
              isDragging
                ? 'border-orange-400 bg-orange-50'
                : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="space-y-4">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>

            <div>
              <p className="text-lg font-medium text-gray-600">
                {isDragging
                  ? 'Suelta la imagen aquí'
                  : 'Arrastra una imagen o haz clic para seleccionar'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Formatos soportados: JPG, PNG, GIF, WebP (máximo 5MB)
              </p>
            </div>

            <button
              type="button"
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Seleccionar imagen
            </button>
          </div>
        </div>
      ) : (
        /* Preview de la imagen */
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <img src={preview} alt="Preview del cóctel" className="w-full h-64 object-cover" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              title="Eliminar imagen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onChange({ image_url: null, image_file: null });
            }}
            className="px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Cambiar imagen
          </button>
        </div>
      )}

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="imageCredits" className="block text-sm font-medium text-gray-700 mb-2">
            Créditos de la imagen
          </label>
          <input
            type="text"
            id="imageCredits"
            value={data.image_credits || ''}
            onChange={e => onChange({ image_credits: e.target.value })}
            placeholder="Ej: Fotografía por Juan Pérez"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="imageAlt" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción alternativa
          </label>
          <input
            type="text"
            id="imageAlt"
            value={data.image_alt || ''}
            onChange={e => onChange({ image_alt: e.target.value })}
            placeholder="Describe la imagen para accesibilidad"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          />
        </div>
      </div>

      {/* Consejos */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2">
          📸 Consejos para buenas fotos
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Usa buena iluminación natural cuando sea posible</li>
          <li>• Incluye la guarnición y decoración final</li>
          <li>• Toma la foto desde un ángulo ligeramente superior</li>
          <li>• Mantén el fondo simple y limpio</li>
          <li>• Asegúrate de que el vaso esté bien centrado</li>
        </ul>
      </div>

      {/* Opciones de imagen por defecto */}
      {!preview && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">¿No tienes una imagen?</h4>
          <p className="text-sm text-gray-600 mb-3">
            Puedes crear el cóctel sin imagen y añadirla más tarde, o usar una de nuestras imágenes
            genéricas.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { name: 'Cóctel clásico', value: '/images/default-classic.jpg' },
              { name: 'Cóctel tropical', value: '/images/default-tropical.jpg' },
              { name: 'Cóctel elegante', value: '/images/default-elegant.jpg' },
              { name: 'Cóctel colorido', value: '/images/default-colorful.jpg' },
            ].map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setPreview(option.value);
                  onChange({ image_url: option.value, image_file: null });
                }}
                className="p-2 text-xs text-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

ImagenForm.propTypes = {
  data: PropTypes.shape({
    image_url: PropTypes.string,
    image_file: PropTypes.object,
    image_credits: PropTypes.string,
    image_alt: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ImagenForm;
