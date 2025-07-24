import PropTypes from 'prop-types';

function StepIndicator({ steps, currentStep, onStepClick }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = index <= currentStep;

        return (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm transition-all ${
                  isCompleted
                    ? 'bg-green-600 border-green-600 text-white hover:bg-green-700'
                    : isCurrent
                      ? 'bg-orange-600 border-orange-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                {isCompleted ? '✓' : index + 1}
              </button>

              {/* Step Info */}
              <div className="ml-3 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    isCurrent ? 'text-orange-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 hidden md:block">{step.description}</p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

StepIndicator.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  currentStep: PropTypes.number.isRequired,
  onStepClick: PropTypes.func.isRequired,
};

export default StepIndicator;
