"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  pricePerExtra: number;
}

interface Booking {
  id: string;
  package: Package;
  addOns?: AddOn[];
  appointmentDate: string;
  timeSlot: string;
}
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CreditCard, ArrowLeft, CheckCircle } from "lucide-react";

export default function PaymentPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Refs to track initialization state
  const bookingCreated = useRef(false);
  const bookingFetched = useRef(false);

  // Get bookingId from URL or session storage once
  const bookingIdFromURL = searchParams.get('bookingId')?.replace(/"/g, '');
  const bookingIdFromStorage = typeof window !== 'undefined' ? sessionStorage.getItem('bookingId') : null;
  const bookingId = bookingIdFromURL || bookingIdFromStorage;
  
  // Form data for pending booking creation
  const formData = typeof window !== 'undefined' ? sessionStorage.getItem('bookingFormData') : null;
  const pendingBookingCreation = typeof window !== 'undefined' ? sessionStorage.getItem('statusPayment') === 'pending' : false;

  // Store bookingId from URL to session storage if available (only once)
  useEffect(() => {
    if (bookingIdFromURL && typeof window !== 'undefined') {
      sessionStorage.setItem('bookingId', bookingIdFromURL);
    }
  }, [bookingIdFromURL]);

  // Main effect to handle booking creation or fetching
  useEffect(() => {
    const initializeBooking = async () => {
      // Only proceed if authentication is complete
      if (authStatus === "loading") return;
      
      // Case 1: Create new booking if pending and authenticated
      if (pendingBookingCreation && formData && authStatus === "authenticated" && !bookingCreated.current) {
        bookingCreated.current = true; // Mark as handled to prevent duplicate creation
        await handleCreateBooking(JSON.parse(formData));
        return;
      } 
      
      // Case 2: Fetch existing booking if available and authenticated
      if (bookingId && authStatus === "authenticated" && !bookingFetched.current) {
        bookingFetched.current = true; // Mark as handled to prevent duplicate fetches
        await fetchBookingDetails();
        return;
      }
      
      // Case 3: No action needed, just finish loading
      if (!isLoading && (authStatus === "authenticated" || authStatus === "unauthenticated")) {
        setIsLoading(false);
      }
    };

    initializeBooking();
  }, [authStatus, bookingId, pendingBookingCreation, formData]);

  const fetchBookingDetails = async () => {
    if (!bookingId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments?bookingId=${bookingId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }

      const data = await response.json();
      setBookingData(data.booking);
      setTotalAmount(data.totalAmount);
      setIsPaid(data.isPaid);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBooking = async (formData:any) => {
    try {
      setIsProcessing(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const data = await response.json();
      
      // Store the new booking ID and clean up session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('bookingId', data.booking.id);
        sessionStorage.removeItem('bookingFormData');
        sessionStorage.removeItem('statusPayment');
      }

      toast.success("Booking created successfully!");

      // Set the booking data directly instead of fetching again
      setBookingData(data.booking);

      // Calculate the total amount directly
      let total = 0;
      if (data.booking.package && data.booking.package.price) {
        total = data.booking.package.price;
      }
      if (data.booking.addOns && data.booking.addOns.length) {
        data.booking.addOns.forEach((addon :any)=> {
          total += addon.price;
        });
      }
      setTotalAmount(total);
      
    } catch (error) {
      toast.error("Failed to create booking");
      console.error(error);
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    if (authStatus === "unauthenticated") {
      const currentUrl = window.location.pathname + (bookingId ? `?bookingId=${bookingId}` : '');
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
      toast.warning("Please login to proceed with payment");
      return;
    }

    if (authStatus === "loading") {
      toast.info("Checking your session...");
      return;
    }

    if (!bookingId) {
      toast.error("No booking found to process payment");
      return;
    }

    if (totalAmount <= 0) {
      toast.error("Invalid payment amount");
      return;
    }

    try {
      setIsProcessing(true);
      const cleanBookingId = bookingId?.replace(/['"\\]/g, '');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: cleanBookingId,
          amount: totalAmount.toFixed(2),
          paymentMethod: 'Credit Card'
        }), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment processing failed');
      }

      const data = await response.json();
      
      toast.success(`Payment successful! Transaction ID: ${data.transactionId}`);
      setIsPaid(true);
      
      // Clear session storage after successful payment
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('bookingId');
      }
      
      // Redirect to booking details after a delay
      setTimeout(() => {
        router.push('/dash');
      }, 3000);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Payment failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const goToBookings = () => {
    router.push('/dash');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-emerald-600" />
          <p className="mt-4 text-lg">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-0">
          <div className="bg-emerald-600 p-6 text-white">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="h-8 w-8" />
              <h2 className="text-2xl font-bold text-center">Payment Complete</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-6 text-center">
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <CheckCircle className="h-12 w-12 mx-auto text-emerald-600 mb-2" />
              <p className="text-lg font-medium text-emerald-800">
                Payment of ${totalAmount.toFixed(2)} was successful!
              </p>
              <p className="text-sm text-emerald-700 mt-2">
                Your booking has been confirmed.
              </p>
            </div>
            
            <Button 
              onClick={goToBookings}
              className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-lg font-medium shadow-md"
            >
              Go to dash
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-0">
        <div className="bg-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-emerald-700 p-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold text-center flex-1">Payment Gateway</h2>
            <div className="w-8"></div> {/* Spacer for centering */}
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {authStatus === "authenticated" && (
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <p className="text-sm text-emerald-800">
                Logged in as <span className="font-medium">{session?.user?.email}</span>
              </p>
            </div>
          )}

          {bookingData && bookingData.package && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <h3 className="font-medium text-gray-800">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-500">Package:</p>
                <p className="text-gray-800 font-medium">{bookingData.package.name}</p>

                <p className="text-gray-500">Date:</p>
                <p className="text-gray-800">{new Date(bookingData.appointmentDate).toLocaleDateString()}</p>

                <p className="text-gray-500">Time:</p>
                <p className="text-gray-800">{bookingData.timeSlot}</p>
              </div>

              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Package price:</span>
                  <span>${bookingData.package.price.toFixed(2)}</span>
                </div>

                {bookingData.addOns && bookingData.addOns.length > 0 && (
                  <>
                    {bookingData.addOns.map((addon) => (
                      <div key={addon.id} className="flex justify-between text-sm">
                        <span>{addon.name}:</span>
                        <span>${addon.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </>
                )}

                <div className="flex justify-between font-medium text-base mt-2 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between font-medium text-lg">
                <span>Total Amount:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-lg font-medium shadow-md"
              disabled={isProcessing || authStatus === "loading" || !bookingId}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay ${totalAmount.toFixed(2)}
                </>
              )}
            </Button>

            {authStatus === "unauthenticated" && (
              <p className="text-sm text-center text-red-600 bg-red-50 p-2 rounded-lg">
                You must be logged in to make a payment
              </p>
            )}
            
            {!bookingId && authStatus === "authenticated" && (
              <p className="text-sm text-center text-amber-600 bg-amber-50 p-2 rounded-lg">
                No booking selected. Please select a booking to pay for.
              </p>
            )}
          </form>

          <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-100">
            <p>Secure payment processing. Your card details are encrypted.</p>
          </div>
        </div>
      </div>
    </div>
  );
}