import { RadiobuttonIcon, ValueIcon, DotFilledIcon } from '@radix-ui/react-icons';
interface DateTimeStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function PersonalDetailsStep({ formData, updateFormData, onNext, onPrevious }: DateTimeStepProps) {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>



        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>

          <input
            type="text"
            placeholder="First Name"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={formData.firstName || ''}
            onChange={(e) => updateFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-4">Last Name</label>

          <input
            type="text"
            placeholder="Last Name"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={formData.lastName || ''}
            onChange={(e) => updateFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-4">Phone Number</label>

          <input
            type="phone"
            placeholder="Phone Number"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={formData.phoneNumber || ''}
            onChange={(e) => updateFormData({ ...formData, phoneNumber: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-4">Email Address</label>

          <input
            type="email"
            placeholder="Email Address"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={formData.email || ''}
            onChange={(e) => updateFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-4">Additional Requests (Optional)</label>
          <textarea
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            rows={3}
            placeholder="Additional Requests"
            value={formData.additionalRequests || ''}
            onChange={(e) => updateFormData({ ...formData, additionalRequests: e.target.value })}
          />
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