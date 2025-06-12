import React, { useState, useRef, useEffect} from 'react';
import { X } from 'lucide-react';
import { Paypal, Payoneer, WithdrawEarnings} from '@/components/icons';

interface Transaction {
    invoiceId: string;
    customerName: string;
    bookingDetails: string;
    amountPaid: string;
    status: "Completed" | "Failed";
}

interface WithdrawEarningsModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

const WithdrawEarningsModal: React.FC<WithdrawEarningsModalProps> = ({ 
    isOpen, 
    onClose, 
    transaction 
}) => {
    const [selectedMethod, setSelectedMethod] = useState('PayPal');
    const [withdrawAmount, setWithdrawAmount] = useState('250');
    const modalRef = useRef<HTMLDivElement>(null);

    const handleWithdraw = () => {
        if (selectedMethod && withdrawAmount) {
            alert(`Withdrawing AED ${withdrawAmount} via ${selectedMethod} for ${transaction?.invoiceId}`);
            onClose();
        } else {
            alert('Please select a payment method and enter an amount');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
                ref={modalRef}
                className="bg-white rounded-lg w-full max-w-sm mx-auto"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Close Button */}
                <div className="flex justify-end pt-4 px-4">
                    <button 
                        onClick={onClose}
                        className="text-[#101828] hover:text-gray-800 transition-colors"
                    >
                        <X size={25} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="px-6 pb-6">
                    {/* Illustration */}
                    <div className="flex justify-center mb-3">
                        <WithdrawEarnings height={160} width={190}/>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-semibold text-[#101828] mb-1">
                            Withdraw your Earnings
                        </h3>
                        <p className="text-sm text-[#646973] mb-1">Available for Withdraw</p>
                        <div className="inline-block px-3 py-1.5  bg-[#F1F1F2] font-semibold text-[#101828] rounded-lg">
                            AED 250.73
                        </div>
                    </div>

                    {/* Amount Display */}
                    <div className="text-center mb-6">
                        <div className="text-left">
                            <div className="text-sm text-[#515662] mb-2">
                                How much do you want to Withdraw?
                            </div>
                            <div className="relative mb-1">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-[#93979E] pointer-events-none">
                                    AED
                                </span>
                                <input
                                    type="number"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    className="w-full pl-12 pr-3 py-2 border border-[#DBDCDF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="250"
                                />
                            </div>
                            <div className="text-xs text-[#667085]">
                                Minimum Limit: AED 100.00
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="mb-6">
                        <div className="text-sm text-[#101828] mb-3">
                            Select your Withdraw method
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {/* PayPal Option */}
                            <div
                                className={`border rounded-lg pt-4 px-4 cursor-pointer transition-all ${
                                    selectedMethod === 'PayPal'
                                        ? 'border-[#0F553E] bg-[#E7EEEC]'
                                        : 'border-gray-300'
                                }`}
                                onClick={() => setSelectedMethod('PayPal')}
                            >
                                <div className="flex items-center justify-center">
                                    <Paypal size={60} />
                                </div>
                            </div>

                            {/* Payoneer Option */}
                            <div
                                className={`border rounded-lg py-2 px-4 cursor-pointer transition-all ${
                                    selectedMethod === 'Payoneer'
                                        ? 'border-[#0F553E] bg-[#E7EEEC]'
                                        : 'border-gray-300'
                                }`}
                                onClick={() => setSelectedMethod('Payoneer')}
                            >
                                <div className="flex items-center justify-center">
                                    <Payoneer size={80} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Withdraw Button */}
                    <button
                        onClick={handleWithdraw}
                        className="w-full bg-[#0F553E] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1a5e47] transition-colors 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg"
                    >
                        Withdraw
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WithdrawEarningsModal;