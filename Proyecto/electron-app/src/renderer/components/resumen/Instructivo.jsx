import { useState } from 'react';

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
      <h4 className="text-2xl font-semibold mb-4">Preparación</h4>
      <div className="flex items-center justify-between">
        {currentStepIndex > 0 ? (
          <button onClick={goPrev} className="text-gray-600 hover:text-gray-800">
            &lt;
          </button>
        ) : (
          <div className="w-6" />
        )}
        <p className="text-gray-700 text-center flex-1 mx-4">
          {currentStep.instruction || currentStep.instruccion || 'Sin instrucción disponible'}
        </p>
        {currentStepIndex < totalSteps - 1 ? (
          <button onClick={goNext} className="text-gray-600 hover:text-gray-800">
            &gt;
          </button>
        ) : (
          <div className="w-6" />
        )}
      </div>
    </div>
  );
};

export default Instructivo;
