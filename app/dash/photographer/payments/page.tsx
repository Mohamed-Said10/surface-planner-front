"use client";
import React, { useState, useCallback, useEffect, useRef }from "react";
import { AverageCoins, ActiveJobsLabel, DollarSign, Download} from '@/components/icons';
import WithdrawEarningsModal from '@/components/modals/WithdrawEarningsModal';
import { EarningsBarChart } from '@/components/charts/earningsBarChart';


interface Transaction {
    invoiceId: string;
    customerName: string;
    bookingDetails: string;
    amountPaid: string;
    status: "Completed" | "Failed";
}

export interface Booking {
  id: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  photographerId: string | null;
  status: "BOOKING_CREATED" |"PHOTOGRAPHER_ASSIGNED"| "SHOOTING" | "EDITING" | "COMPLETED" | "CANCELLED";
  packageId: number;
  propertyType: string;
  propertySize: string;
  buildingName: string;
  unitNumber: string;
  floor: string;
  street: string;
  villaNumber: string | null;
  company: string | null;
  appointmentDate: string;
  timeSlot: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  additionalDirections: string | null;
  additionalRequests: string | null;
  additionalInfo: string | null;
  isPaid: boolean;

  // relations
  package: {
    id: number;
    name: string;
    price: number;
    description: string;
    features: string[];
    pricePerExtra: number;
  };

  addOns: {
    id: string;
    name: string;
    price: number;
    addonId: string;
    bookingId: string;
  }[];

  client: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  };

  photographer: {
    id: string;
    firstname: string;
    lastname: string;
    email?: string;
  } | null;
}

// Recent transactions data
const recentTransactions: Transaction[] = [
    {
        invoiceId: "INV-00123",
        customerName: "John Doe",
        bookingDetails: "Photography - 3D Tour",
        amountPaid: "$ 250.00",
        status: "Completed",
    },
    {
        invoiceId: "INV-00125",
        customerName: "Mark Brown",
        bookingDetails: "Floor Plan Service",
        amountPaid: "$150.00",
        status: "Failed",
    },
    {
        invoiceId: "INV-00123",
        customerName: "John Doe",
        bookingDetails: "Photography - 3D Tour",
        amountPaid: "$ 250.00",
        status: "Completed",
    },
    {
        invoiceId: "INV-00125",
        customerName: "Mark Brown",
        bookingDetails: "Floor Plan Service",
        amountPaid: "$150.00",
        status: "Failed",
    },
    {
        invoiceId: "INV-00123",
        customerName: "John Doe",
        bookingDetails: "Photography - 3D Tour",
        amountPaid: "$ 250.00",
        status: "Completed",
    },
];

export default function PaymentsPage() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        activeJobsAmount: 0,
        avgEarningPerBooking: 0
    });

    const requestInProgress = useRef(false);

    const fetchBookings = useCallback(async () => {
    if (requestInProgress.current) return;
    requestInProgress.current = true;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch bookings');

        return data;
    } finally {
        requestInProgress.current = false;
    }
    }, []);

    useEffect(() => {
    const loadStats = async () => {
        try {
        const data = await fetchBookings();
        if (!data) return;

        const bookings = data.bookings;

        const completedBookings = bookings.filter(
            (booking: Booking) => booking.status === 'COMPLETED'
        );

        const activeBookings = bookings.filter(
            (booking: Booking) => !['COMPLETED', 'CANCELLED'].includes(booking.status)
        );

        const totalEarnings = completedBookings.reduce((sum: number, booking: Booking) => {
            const packagePrice = booking.package?.price || 0;
            const addOnsPrice = booking.addOns?.reduce((aSum, a) => aSum + a.price, 0) || 0;
            return sum + packagePrice + addOnsPrice;
        }, 0);

        const activeJobsAmount = activeBookings.reduce((sum: number, booking: Booking) => {
            if (!booking.isPaid) return sum;
            const packagePrice = booking.package?.price || 0;
            const addOnsPrice = booking.addOns?.reduce((aSum, a) => aSum + a.price, 0) || 0;
            return sum + packagePrice + addOnsPrice;
        }, 0);

        const avgEarningPerBooking = completedBookings.length > 0
            ? totalEarnings / completedBookings.length
            : 0;

        setStats({
            totalEarnings,
            activeJobsAmount,
            avgEarningPerBooking
        });
        } catch (err) {
        console.error('Error loading booking stats:', err);
        }
    };

    loadStats();
    }, [fetchBookings]);


    const handleViewInvoice = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };
  
  return (
    <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-2 space-y-5">
                <div className="bg-white border border-[#DBDCDF] rounded-lg p-5 flex items-center gap-2">
                    <div className="p-4 border border-[#DBDCDF] rounded-md">
                        <DollarSign size={25} />
                    </div>
                    <div>
                        <div className="text-xs text-[#515662]">Total Earnings</div>
                        <div className="text-xl font-semibold text-[#101828]">AED {stats.totalEarnings}</div>
                    </div>
                </div>

                <div className="bg-white border border-[#DBDCDF] rounded-lg p-5 flex items-center gap-2">
                    <div className="p-4 border border-[#DBDCDF] rounded-md">
                        <ActiveJobsLabel size={25} />
                    </div>
                    <div>
                        <div className="text-xs text-[#515662]">Active Jobs Amount</div>
                        <div className="text-xl font-semibold text-[#101828]">AED {stats.activeJobsAmount}</div>
                    </div>
                </div>

                <div className="bg-white border border-[#DBDCDF] rounded-lg p-5 flex items-center gap-2">
                    <div className="p-4 border border-[#DBDCDF] rounded-md">
                        <AverageCoins size={25} />
                    </div>
                    <div>
                        <div className="text-xs text-[#515662]">Avg. Earning per Booking</div>
                        <div className="text-xl font-semibold text-[#101828]">AED {stats.avgEarningPerBooking}</div>
                    </div>
                </div>
            </div>

            <div className="col-span-4 bg-white border border-[#DBDCDF] rounded-lg pr-4 pt-1 mb-4">
                <div className="flex justify-between items-center my-6">
                <h2 className="text-lg font-semibold text-[#101828] px-4">Earnings</h2>
                <select className="border border-gray-300 rounded-lg pl-3 pr-12 py-1 text-sm text-gray-700 focus:outline-none focus:ring-0">
                    <option>2024</option>
                    <option>2023</option>
                    <option>2022</option>
                </select>
                </div>
                <EarningsBarChart />
            </div>
        </div>



      {/* Recent Transactions */}
      <div className="bg-white border border-[#DBDCDF] rounded-lg p-6">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#DBDCDF]">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 border border-[#DBDCDF] rounded-md px-3 py-1.5">
            <Download size={15} />
            Download Reports
            </button>
        </div>
        <div className="overflow-x-auto border border-[#DBDCDF] rounded-lg">
            <table className="w-full">
            <thead className="text-[#343B48] ">
                <tr className="text-left bg-[#F5F6F6]">
                <th className="p-4 text-sm font-medium border-b border-r border-[#DBDCDF]">Invoice ID</th>
                <th className="p-4 text-sm font-medium border-b border-r border-[#DBDCDF]">Customer Name</th>
                <th className="p-4 text-sm font-medium border-b border-r border-[#DBDCDF]">Booking Details</th>
                <th className="p-4 text-sm font-medium border-b border-r border-[#DBDCDF]">Amount Paid</th>
                <th className="p-4 text-sm font-medium border-b border-r border-[#DBDCDF]">Status</th>
                <th className="p-4 text-sm font-medium border-b border-[#DBDCDF]">Actions</th>
                </tr>
            </thead>
            <tbody className="text-[#515662]">
                {recentTransactions.map((transaction, index) => (
                <tr key={index} className={index !== recentTransactions.length - 1 ? "border-b border-[#DBDCDF]" : ""}>
                    <td className="p-4 text-sm border-r border-[#DBDCDF]">{transaction.invoiceId}</td>
                    <td className="p-4 text-sm border-r border-[#DBDCDF]">{transaction.customerName}</td>
                    <td className="p-4 text-sm border-r border-[#DBDCDF]">{transaction.bookingDetails}</td>
                    <td className="p-4 text-sm border-r border-[#DBDCDF]">{transaction.amountPaid}</td>
                    <td className="p-4 text-sm border-r border-[#DBDCDF]">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === "Completed" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                        {transaction.status}
                    </span>
                    </td>
                    <td className="p-4 text-sm">
                    <button 
                      onClick={() => handleViewInvoice(transaction)}
                      className="text-[#101828] underline">View Invoice
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      {/* Withdraw Modal */}
      {isModalOpen && (
            <WithdrawEarningsModal 
                isOpen={isModalOpen}
                onClose={closeModal}
                transaction={selectedTransaction}
            />
        )}
    </div>
    
  );
  
}