/* eslint-disable react/jsx-key */
import Spinner from "../../shared/spinner";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

interface SummaryStepProps {
  formData: any;
  onPrevious: () => void;
  onNext: () => void;
}

export default function SummaryStep({ formData, onPrevious, onNext }: SummaryStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const calculateTotal = () => {
    let total = formData.selectedPackage.price;

    // Add-ons
    if (formData.addOns) {
      formData.addOns.forEach((addon: any) => {
        total += addon.price
      });
    }

    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if user is authenticated
    if (!session) {
      // Clear any previous booking data to prevent conflicts
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('bookingId');
      }
      
      // Save form data to sessionStorage for retrieval after login
      sessionStorage.setItem('bookingFormData', JSON.stringify(formData));
      sessionStorage.setItem('statusPayment', "pending");
      
      // Redirect to login with callback URL to payment page
      router.push(`/auth/login?callbackUrl=${encodeURIComponent('/payment')}`);
      return;
    }

    try {
      // User is authenticated, create booking
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create booking');
      }
      
      const data = await response.json();
      
      // Store booking ID and clear previous form data
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('bookingId', data.booking.id);
        // Remove pending status as it's already created
        sessionStorage.removeItem('bookingFormData');
        sessionStorage.removeItem('statusPayment');
      }

      // Redirect to payment page
      router.push('/payment');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white overflow-hidden">
        <div className="mb-4 px-2">
          <h2 className="text-xl font-medium text-gray-900">Summary</h2>
        </div>

        <div className="rounded-lg border border-gray-200 px-6 py-4 my-2 mb-6">
          <div className="flex flex-col">
            <div className="flex flex-row items-center gap-4">
              <div className="rounded-lg border border-gray-200 px-4 py-4">
                <img src="/icons/diamond.svg" alt="" />
              </div>
              <div>
                <p className="text-lg font-bold">{formData.selectedPackage.name}</p>
                {formData.addOns && formData.addOns.length > 0 && <p className="text-sm">
                  Addons: {formData.addOns[0].name}
                </p>}
              </div>
            </div>

            <div className="grid grid-cols-2 mt-4">
              <div className="col-span-1">
                <p className="text-sm text-gray-500">Property Address</p>
                <p className="font-semibold">{formData.buildingName}, Unit {formData.unitNumber}, Floor {formData.floor}</p>
              </div>

              <div className="col-span-1">
                <p className="text-sm text-gray-500">Scheduled Date & Time</p>
                <p className="font-semibold">{new Date(Date.parse(formData.date)).toLocaleDateString("en-GB", dateOptions as any)}, {formData.timeSlot}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 px-6 py-4 bg-gray-100">
          <dl className="space-y-4">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-600">{formData.selectedPackage.name}</dt>
              <dd className="text-sm text-gray-900 font-bold">AED {formData.selectedPackage.price}</dd>
            </div>
            {formData.addOns && formData.addOns.length > 0 && (
              formData.addOns.map((addon: any) =>
                <div className="flex justify-between" key={addon.id}>
                  <dt className="text-sm font-medium text-gray-600">Addon: {addon.name}</dt>
                  <dd className="text-sm text-gray-900 font-bold">AED {addon.price}</dd>
                </div>
              )
            )}
          </dl>
          <hr className="bg-gray-300 h-[2px] width-[90%] mt-4" />
          <div className="flex justify-between mt-4">
            <dt className="text-base font-medium text-gray-900">Total</dt>
            <dd className="text-base text-gray-900 font-bold">{calculateTotal()} AED</dd>
          </div>
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
          disabled={isSubmitting}
          className="w-[160px] text-center bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
        >
          {isSubmitting || formData.isLoading ? <Spinner /> : <span>Confirm Booking</span>}
        </button>
      </div>
    </form>
  );
}