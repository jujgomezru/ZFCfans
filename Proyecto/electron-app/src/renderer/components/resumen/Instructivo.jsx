import { useState } from 'react';
import { BackIcon, ClockIcon, ForwardIcon } from '../icons/Icons';

const Instructivo = ({ steps = [] }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const totalSteps = steps.length;

  // Validación defensiva
  if (!steps || steps.length === 0) {
    return (
      <div className="p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h4 className="text-2xl font-semibold mb-4">Preparación</h4>
        <p className="text-gray-500 text-center">No hay pasos de preparación disponibles</p>
      </div>
    );
  }

  const goPrev = () => setCurrentStepIndex(idx => Math.max(idx - 1, 0));
  const goNext = () => setCurrentStepIndex(idx => Math.min(idx + 1, totalSteps - 1));

  const currentStep = steps[currentStepIndex];
  if (!currentStep) {
    return (
      <div className="p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h4 className="text-2xl font-semibold mb-4">Preparación</h4>
        <p className="text-gray-500 text-center">Paso no disponible</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-2xl font-semibold">Preparación</h4>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Paso {currentStepIndex + 1} de {totalSteps}
          </span>
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 min-h-[120px] flex items-center">
        <div className="w-full">
          <div className="flex items-start space-x-4">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                currentStep.is_critical ? 'bg-red-500' : 'bg-blue-500'
              }`}
            >
              {currentStepIndex + 1}
            </div>
            <p className="text-gray-800 text-lg leading-relaxed flex-1">
              {currentStep.instruction || currentStep.instruccion || 'Sin instrucción disponible'}
            </p>
          </div>

          {currentStep.duration && (
            <div className="mt-4 text-sm text-gray-600 flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              Duración aproximada: {currentStep.duration} minutos
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={goPrev}
          disabled={currentStepIndex === 0}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            currentStepIndex === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          <BackIcon className="w-5 h-5 mr-1" />
          Anterior
        </button>

        <button
          onClick={goNext}
          disabled={currentStepIndex === totalSteps - 1}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            currentStepIndex === totalSteps - 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
          }`}
        >
          Siguiente
          <ForwardIcon className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Instructivo;
