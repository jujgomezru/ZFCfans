import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

function InstruccionesForm({ data, onChange }) {
  const instructions = useMemo(() => data.instructions || [], [data.instructions]);

  const handleAddInstruction = useCallback(() => {
    const newInstructions = [
      ...instructions,
      {
        id: Date.now() + Math.random(), // ID único
        step: instructions.length + 1,
        description: '',
      },
    ];
    onChange({ instructions: newInstructions });
  }, [instructions, onChange]);

  const handleUpdateInstruction = useCallback(
    (index, description) => {
      const newInstructions = instructions.map((instruction, i) =>
        i === index ? { ...instruction, description } : instruction,
      );
      onChange({ instructions: newInstructions });
    },
    [instructions, onChange],
  );

  const handleRemoveInstruction = useCallback(
    index => {
      const newInstructions = instructions
        .filter((_, i) => i !== index)
        .map((instruction, i) => ({ ...instruction, step: i + 1 }));
      onChange({ instructions: newInstructions });
    },
    [instructions, onChange],
  );

  const handleMoveInstruction = useCallback(
    (fromIndex, toIndex) => {
      if (toIndex < 0 || toIndex >= instructions.length) {
        return;
      }

      const newInstructions = [...instructions];
      const [movedItem] = newInstructions.splice(fromIndex, 1);
      newInstructions.splice(toIndex, 0, movedItem);

      // Reordenar los números de paso
      const reorderedInstructions = newInstructions.map((instruction, i) => ({
        ...instruction,
        step: i + 1,
      }));

      onChange({ instructions: reorderedInstructions });
    },
    [instructions, onChange],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Instrucciones de Preparación</h2>
        <p className="text-gray-600">
          Describe paso a paso cómo preparar el cóctel de manera clara y detallada
        </p>
      </div>

      {/* Lista de instrucciones */}
      <div className="space-y-4">
        {instructions.length > 0 && (
          <h3 className="text-lg font-semibold text-gray-800">Pasos ({instructions.length})</h3>
        )}

        {instructions.map((instruction, index) => (
          <div
            key={instruction.id || `instruction-${index}`}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex items-start gap-4">
              {/* Número del paso */}
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold text-sm">
                {instruction.step}
              </div>

              {/* Campo de descripción */}
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">
                  ID: {instruction.id} | Index: {index}
                </div>
                <textarea
                  value={instruction.description}
                  onChange={e => handleUpdateInstruction(index, e.target.value)}
                  placeholder={`Describe el paso ${instruction.step}...`}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-transparent resize-none"
                />
              </div>

              {/* Controles */}
              <div className="flex flex-col gap-1">
                {/* Mover arriba */}
                <button
                  type="button"
                  onClick={() => handleMoveInstruction(index, index - 1)}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Mover arriba"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>

                {/* Mover abajo */}
                <button
                  type="button"
                  onClick={() => handleMoveInstruction(index, index + 1)}
                  disabled={index === instructions.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Mover abajo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Eliminar */}
                <button
                  type="button"
                  onClick={() => handleRemoveInstruction(index)}
                  className="p-1 text-red-400 hover:text-red-600"
                  title="Eliminar paso"
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
            </div>
          </div>
        ))}

        {/* Botón para añadir nueva instrucción */}
        <button
          type="button"
          onClick={handleAddInstruction}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-orange-300 hover:text-orange-600 transition-colors"
        >
          <svg
            className="w-6 h-6 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Añadir paso {instructions.length + 1}
        </button>
      </div>

      {/* Mensaje cuando no hay instrucciones */}
      {instructions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>No has añadido ninguna instrucción aún</p>
          <p className="text-sm">Usa el botón de arriba para añadir el primer paso</p>
        </div>
      )}

      {/* Consejos */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">
          💡 Consejos para escribir buenas instrucciones
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Usa verbos en imperativo (mezcla, agita, sirve)</li>
          <li>• Especifica tiempos y temperaturas cuando sea relevante</li>
          <li>• Menciona técnicas específicas (agitar vigorosamente, mezclar suavemente)</li>
          <li>• Incluye detalles sobre la presentación final</li>
        </ul>
      </div>

      {/* Ejemplos de técnicas comunes */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-green-800 mb-2">🍸 Técnicas comunes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700">
          <div>
            <strong>Shake:</strong> Agitar con hielo 10-15 segundos
          </div>
          <div>
            <strong>Stir:</strong> Mezclar suavemente con cuchara
          </div>
          <div>
            <strong>Build:</strong> Construir directamente en el vaso
          </div>
          <div>
            <strong>Muddle:</strong> Machacar ingredientes suavemente
          </div>
          <div>
            <strong>Float:</strong> Flotar un ingrediente encima
          </div>
          <div>
            <strong>Strain:</strong> Colar usando colador doble
          </div>
        </div>
      </div>
    </div>
  );
}

InstruccionesForm.propTypes = {
  data: PropTypes.shape({
    instructions: PropTypes.arrayOf(
      PropTypes.shape({
        step: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default InstruccionesForm;
