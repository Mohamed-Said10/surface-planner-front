
import { ValueIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
interface PackageSelectionStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function PackageSelectionStep({ formData, updateFormData, onNext, onPrevious }: PackageSelectionStepProps) {

  const [isSilverDisabled, setIsSilverDisabled] = useState(false);
  const [isGoldDisabled, setIsGoldDisabled] = useState(false);
  console.log(formData);
  const calculatePackagePrices = () => {
    let silverPrice = 600;
    let goldPrice = 1100;
    let diamondPrice = 1600;
    const propertySize = formData.propertySize;
    const maxSize = 1000;
    const propertyExtraSize = 0;

    if (propertySize > 1000) {
      const propertyExtraSize = propertySize - 1000;
      silverPrice += propertyExtraSize * 0.1
      goldPrice += propertyExtraSize * 0.15
      diamondPrice += propertyExtraSize * 0.2
    }
    return {silverPrice, goldPrice, diamondPrice}
  }
  const packages = [
    {
      id: 1,
      name: 'Silver Package',
      price: calculatePackagePrices().silverPrice,
      description: 'Perfect for basic real estate listings.',
      features: ['3 AI Room Staging Photos', '12 High-Quality Photos', '2D Floor Plan'],
      pricePerExtra: 0.1
    },
    {
      id: 2,
      name: 'Gold Package',
      price: calculatePackagePrices().goldPrice,
      description: 'Great for engaging property presentations.',
      features: ['18 High-Quality Photos', '2D Floor Plan', '7 AI Room Staging Photos', '1-2 Minute Video Tour'],
      pricePerExtra: 0.15
    },
    {
      id: 3,
      name: 'Diamond Package',
      price: calculatePackagePrices().diamondPrice,
      description: 'The ultimate package for high-end listings.',
      features: ['30 High-Quality Photos', '20 AI Room Staging Photos', '2D & 3D Floor Plan', '360° Virtual Tour'],
      pricePerExtra: 0.2
    }
  ];

  const query = useSearchParams();
  const packageId = Number(query.get('p'));
  
  const [selectedPAckage, setSelectedPackageId] = useState(2);
  useEffect(() => {
    if (packageId) {
      const selectedPackage = packages.filter(el => el.id === packageId)[0];
      console.log('selectedPackage: ', selectedPackage);

      console.log("selectedPackage: ", selectedPackage, packageId);
      setIsSilverDisabled(packageId === 2 || packageId === 3)
      setIsGoldDisabled(packageId === 3);
      setSelectedPackageId(packageId)
      updateFormData({ ...formData, selectedPackage: selectedPackage });
    }
  }, [])
  const addOns = [
    { id: '1', name: '5 Photos', price: 165 },
    { id: '2', name: '10 Photos', price: 300 },
    { id: '3', name: '15 Photos', price: 400 },
    { id: '4', name: 'Video 1-2 mins', price: 400 },
    { id: '5', name: 'Video 2-4 mins', price: 700 },
    { id: '6', name: '360° Virtual Tour', price: 900 }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {packages.map((pkg, index) => (
          <div
            key={pkg.name}
            className={`border rounded-lg p-6 ${(index === 0 && isSilverDisabled) || (index === 1 && isGoldDisabled) ? 'bg-gray-300 border-0' : 'bg-white cursor-pointer'} ${selectedPAckage === pkg.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
              }`}
            onClick={() => {
              if (!(index === 0 && isSilverDisabled) && !(index === 1 && isGoldDisabled)) {
                setSelectedPackageId(pkg.id);
                updateFormData({ ...formData, selectedPackage: pkg })
              }
            }}
          >
            <div className="flex justify-between items-start">
              <div className='flex flex-row items-center gap-4'>
                <div>
                  {(selectedPAckage === pkg.id) && !(index === 0 && isSilverDisabled) && !(index === 1 && isGoldDisabled) ?
                    <CheckCircledIcon className='text-emerald-500 w-[20px] h-[20px]' /> :
                    <ValueIcon className='text-gray-500 w-[20px] h-[20px]' />}
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mt-1">{pkg.name}</h3>
                  <p className="text-2xl font-bold text-gray-900">{pkg.price} AED</p>
                </div>
              </div>
            </div>
            <hr className="bg-red h-[2px] width-[90%] mt-4" />
            <p className="text-black text-sm mt-4 font-semibold">{pkg.description}</p>
            <ul className="mt-2 space-y-2">
              {pkg.features.map((feature) => (
                <li key={feature} className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add-ons</h3>
        <div className="grid grid-cols-2 gap-4">
          {addOns.map((addon,) => (
            <div
              key={addon.name}
              className="flex items-center justify-between p-4 border rounded-lg relative cursor-pointer border hover:border-emerald-600"
            >
              <div 
              className="absolute top-0 left-0 w-[100%] h-[100%]"
              onClick={() => {
                console.log("click1");
                
                    document.getElementById(`addon-${addon.id}`)?.click()
                  
                }
              }
              ></div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`addon-${addon.id}`}
                  className="h-4 w-4 text-red focus:ring-emerald-500 border-gray-300 rounded"
                  checked={formData.addOns?.map((el: any) => el.name).includes(addon.name)}
                  onChange={(e) => {
                    console.log("click2");
                    
                    const currentAddOns = formData.addOns || [];
                    const newAddOns = currentAddOns?.map((el: any) => el.id).includes(addon.id) ? currentAddOns?.filter((el: any) => el.id !== addon.id): [...currentAddOns, addon]


                    updateFormData({ ...formData, addOns: newAddOns });
                  }}
                />
                <span className="ml-3 text-sm text-gray-900">{addon.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{addon.price} AED</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="hover:text-gray-900 border border-emerald-600 rounded-lg px-2 text-emerald-600"
        >
          ← Previous
        </button>
        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
        >
          Next
        </button>
      </div>
    </form>
  );
}