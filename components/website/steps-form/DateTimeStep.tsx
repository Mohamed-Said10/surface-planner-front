import { RadiobuttonIcon, ValueIcon, DotFilledIcon } from '@radix-ui/react-icons';
interface DateTimeStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function DateTimeStep({ formData, updateFormData, onNext, onPrevious }: DateTimeStepProps) {
  const timeSlots = [
    { id: 9, time: '9 AM', isActive: true },
    { id: 10, time: '10 AM', isActive: true },
    { id: 11, time: '11 AM', isActive: true },
    { id: 12, time: '12 PM', isActive: true },
    { id: 13, time: '1 PM', isActive: false },
    { id: 14, time: '2 PM', isActive: true },
    { id: 15, time: '3 PM', isActive: true },
    { id: 16, time: '5 PM', isActive: false },
    { id: 17, time: '6 PM', isActive: false },
    { id: 18, time: '7 PM', isActive: false },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };
  var datenow = new Date(),
  // minimum date the user can choose, in this case now and in the future
  minDate = datenow.toISOString().substring(0,10);
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Select Date</label>
        <input
          type="date"
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={formData.date || ''}
          min={minDate}
          onClick={(e) => e.currentTarget.showPicker()}
          onChange={(e) => updateFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Select Time Slot</label>
        <div className="flex gap-4 flex-wrap">
          
          {timeSlots.map((slot) => (
            <div
              key={slot.id}
              className={`border hover:border-emerald-600 rounded-lg p-4 cursor-pointer ${formData.timeSlot === slot.time ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                }`}
              onClick={() => updateFormData({ ...formData, timeSlot: slot.time })}
            >
                
                    <p className="text-lg font-medium text-gray-900">{slot.time}</p>
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