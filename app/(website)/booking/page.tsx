'use client';

import { useEffect, useState } from 'react';
import StepIndicator from '@/components/website/steps-form/StepIndicator';
import PropertyDetailsStep from '@/components/website/steps-form/PropertyDetailsStep';
import PackageSelectionStep from '@/components/website/steps-form/PackageSelectionStep';
import DateTimeStep from '@/components/website/steps-form/DateTimeStep';
import SummaryStep from '@/components/website/steps-form/SummaryStep';
import PersonalDetailsStep from '@/components/website/steps-form/personalDetailsStep';
import { sendBookingRequest } from '@/helpers/send-booking-request';
import SuccessStep from '@/components/website/steps-form/successStep';

export default function Booking() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({selectedPackage: {
    id: 2,
    name: 'Gold Package',
    price: 1100,
    description: 'Great for engaging property presentations.',
    features: ['18 High-Quality Photos', '2D Floor Plan', '7 AI Room Staging Photos', '1-2 Minute Video Tour'],
    pricePerExtra: 0.15
  }, isLoading: false});
  const steps = ['Property Details', 'Select Package', 'Date & Time', 'Personal Details', 'Price & Payment', 'Success'];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // const handleSubmit = async () => {
  //   setFormData({...formData, isLoading: true})
  //   console.log('Form submitted with data:', formData);
  //   const req = await sendBookingRequest(formData);
  //   setTimeout(() => {
  //     setFormData({...formData, isLoading: false});
  //   }, 1000);
  // };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PropertyDetailsStep
            formData={formData}
            updateFormData={setFormData}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <PackageSelectionStep
            formData={formData}
            updateFormData={setFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 2:
        return (
          <DateTimeStep
            formData={formData}
            updateFormData={setFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <PersonalDetailsStep
            formData={formData}
            updateFormData={setFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <SummaryStep
          onNext={handleNext}
            formData={formData}
            // onSubmit={handleSubmit}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <SuccessStep
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">New Booking</h1>
      <div className="max-w-3xl mx-auto">
        <StepIndicator 
          onStepClick={handleStepClick}
          steps={steps} 
          currentStep={currentStep} 
        />
        <div className="bg-white rounded-lg shadow-sm p-6">
          {renderStep()}
        </div>
      </div>
    </main>
  );
}