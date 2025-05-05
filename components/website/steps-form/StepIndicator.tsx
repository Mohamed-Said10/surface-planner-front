interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex justify-around flex-wrap items-center mb-8 bg-white p-4 rounded-lg">
      {steps.map((step, index) => (
        !['Success'].includes(step) && <div key={step} onClick={() => {
          if (currentStep > index) {
            onStepClick(index);
          }
        }} className={`mb-2 flex flex-col gap-2 ${currentStep > index ? 'cursor-pointer' : ''}`}>
          <div className={`text-sm ${index === currentStep ? 'font-medium' : 'text-gray-500'}`}>
            {step}
          </div>
          <div className={`w-[120px] h-2 rounded-full ${index <= currentStep ? 'bg-emerald-600' : 'bg-gray-300'}`} />
        </div>
      ))}
    </div>
  );
}