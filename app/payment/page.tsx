"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, CreditCard } from "lucide-react";

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status === "unauthenticated") {
      const currentUrl = window.location.pathname;
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
      toast.warning("Please login to proceed with payment");
      return;
    }

    if (status === "loading") {
      toast.info("Checking your session...");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setIsProcessing(true);
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Success! $${parseFloat(amount).toFixed(2)} was processed.`);
      setAmount("");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-0">
        <div className="bg-emerald-600 p-6 text-white">
          <div className="flex items-center justify-center space-x-3">
            <CreditCard className="h-8 w-8" />
            <h2 className="text-2xl font-bold text-center">Payment Gateway</h2>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {status === "authenticated" && (
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <p className="text-sm text-emerald-800">
                Logged in as <span className="font-medium">{session.user?.email}</span>
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Payment Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-8 text-lg py-6"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-lg font-medium shadow-md"
              disabled={isProcessing || status === "loading"}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                "Submit Payment"
              )}
            </Button>

            {status === "unauthenticated" && (
              <p className="text-sm text-center text-red-600 bg-red-50 p-2 rounded-lg">
                You must be logged in to make a payment
              </p>
            )}
          </form>

          <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-100">
            <p>This is a test payment gateway. No real transactions will be processed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}