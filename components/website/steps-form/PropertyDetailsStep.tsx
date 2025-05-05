import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useRouter, useSearchParams } from "next/navigation";
import {DubaiSearchBox} from "../../shared/autocomplete";

interface PropertyDetailsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
}
const FIELDS_PER_TYPE = {
  '1': ['building_name', 'apartment_number'],
  '3': ['House_name'],
  '4': ['building_name', 'company_name'],
}
export default function PropertyDetailsStep({ formData, updateFormData, onNext }: PropertyDetailsStepProps) {
  const query = useSearchParams();
  const type: string = query.get('t') || '1'
  const size = query.get('s') || ''
  const [addressInputs, setAddressInputs] = useState(FIELDS_PER_TYPE[type as keyof typeof FIELDS_PER_TYPE])
  const [selectedType, setSelectedType] = useState(type)

  useEffect(() => {
    updateFormData({ ...formData, propertyType: type || formData.propertyType, propertySize: size || formData.propertySize })
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
        <select
          id="property-type"
          value={formData.propertyType || ''}
          onChange={(e) => {
            updateFormData({ ...formData, propertyType: e.target.value });setSelectedType(e.target.value); setAddressInputs(FIELDS_PER_TYPE[e.target.value as keyof typeof FIELDS_PER_TYPE]); console.log(addressInputs);
          }}
          required
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="" disabled>Select Property Type</option>
          <option value="1">Apartment</option>
          <option value="3">Villa</option>
          <option value="4">Office</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Property Size (sq ft)</label>
        <input
          type="text"
          placeholder="Property Size (sq ft)"
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={formData.propertySize || ''}
          onChange={(e) => {
            e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
            updateFormData({ ...formData, propertySize: e.target.value })
          }}
          required
        />
      </div>

      {addressInputs.includes('building_name') && <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Building Name</label>
        {/* <input
          type="text"
          placeholder="Building Name"
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={formData.buildingName || ''}
          onChange={(e) => updateFormData({ ...formData, buildingName: e.target.value })}
          required
        /> */}
        <DubaiSearchBox initialValue={formData.buildingName || ''} onLocationSelect={(data)=>{
          console.log(data);
          updateFormData({ ...formData, buildingName: data.building !== '' ? data.building : data.subcommunity })
        }}/>
      </div>}

      {addressInputs.includes('House_name') && <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Villa Number</label>
        {/* <input
          type="text"
          placeholder="Villa Number"
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={formData.villaNumber || ''}
          onChange={(e) => updateFormData({ ...formData, villaNumber: e.target.value })}
          required
        /> */}
        <DubaiSearchBox 
          initialValue={formData.villaNumber || ''} 
          onLocationSelect={(data)=>{
          console.log(data);
          updateFormData({ ...formData, villaNumber: data.building !== '' ? data.building : data.subcommunity })
        }}/>
      </div>}

      <div className="grid grid-cols-2 gap-4">
        {addressInputs.includes('apartment_number') && <div>
          <input
            type="text"
            placeholder="Unit Number"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={formData.unitNumber || ''}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
              updateFormData({ ...formData, unitNumber: e.target.value })
            }}
            required
          />
        </div>}
        {addressInputs.includes('company_name') && <div>
          <input
            type="text"
            placeholder="Company"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={formData.company || ''}
            onChange={(e) => updateFormData({ ...formData, company: e.target.value })}
            required
          />
        </div>}
        {addressInputs.includes('apartment_number') && <div>
          <input
            type="text"
            placeholder="Floor"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={formData.floor || ''}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
              updateFormData({ ...formData, floor: e.target.value })
            }}
            required
          />
        </div>}
      </div>
      <div style={addressInputs.includes('apartment_number') || addressInputs.includes('company_name') ? {} : {marginTop: '0px'}}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
        <input
          type="text"
          placeholder="Street"
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={formData.street || ''}
          onChange={(e) => updateFormData({ ...formData, street: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Directions (Optional)</label>
        <textarea
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          rows={3}
          placeholder="Additional Information"
          value={formData.additionalInfo || ''}
          onChange={(e) => updateFormData({ ...formData, additionalInfo: e.target.value })}
        />
      </div>

      <div className="flex justify-end">
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