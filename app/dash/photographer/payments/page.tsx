"use client";
import React from "react";
import { AverageCoins, XCircle, DollarSign, Download} from '@/components/icons';


interface Transaction {
    invoiceId: string;
    customerName: string;
    bookingDetails: string;
    amountPaid: string;
    status: "Completed" | "Failed";
}

// Stats data
  const stats = {
    activeBookings: 12,
    totalEarnings: "57,000",
    pendingPayouts: "4,000",
    averageRating: 4.8,
};

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
  
  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold mb-6">Payments</h1> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Earnings Card */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <div className="p-3 border border-gray-300 rounded-md">
                <DollarSign size={25} />
            </div>
            <div>
                <div className="text-xs text-gray-500">Total Earnings</div>
                <div className="text-xl font-semibold">AED 57,000</div>
            </div>
        </div>

        {/* Average Earning per Booking Card */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <div className="p-3 border border-gray-200 rounded-md">
                <AverageCoins size={25} />
            </div>
            <div>
                <div className="text-xs text-gray-500">Avg. Earning per Booking</div>
                <div className="text-xl font-semibold">AED 127.5</div>
            </div>
        </div>

        {/* Failed Transactions Card */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <div className="p-3 border border-gray-200 rounded-md">
                <XCircle size={25} />
            </div>
            <div>
                <div className="text-xs text-gray-500">Failed Transactions</div>
                <div className="text-xl font-semibold">AED 4,000</div>
            </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md px-3 py-1.5">
            <Download size={15} />
            Download Reports
            </button>
        </div>
        <div className="overflow-x-auto border border-gray-300 rounded-lg">
            <table className="w-full">
            <thead>
                <tr className="text-left bg-gray-50">
                <th className="p-4 text-sm font-medium text-gray-500 border-b border-r border-gray-200">Invoice ID</th>
                <th className="p-4 text-sm font-medium text-gray-500 border-b border-r border-gray-200">Customer Name</th>
                <th className="p-4 text-sm font-medium text-gray-500 border-b border-r border-gray-200">Booking Details</th>
                <th className="p-4 text-sm font-medium text-gray-500 border-b border-r border-gray-200">Amount Paid</th>
                <th className="p-4 text-sm font-medium text-gray-500 border-b border-r border-gray-200">Status</th>
                <th className="p-4 text-sm font-medium text-gray-500 border-b border-gray-200">Actions</th>
                </tr>
            </thead>
            <tbody>
                {recentTransactions.map((transaction, index) => (
                <tr key={index} className={index !== recentTransactions.length - 1 ? "border-b border-gray-200" : ""}>
                    <td className="p-4 text-sm border-r border-gray-200">{transaction.invoiceId}</td>
                    <td className="p-4 text-sm border-r border-gray-200">{transaction.customerName}</td>
                    <td className="p-4 text-sm border-r border-gray-200">{transaction.bookingDetails}</td>
                    <td className="p-4 text-sm border-r border-gray-200">{transaction.amountPaid}</td>
                    <td className="p-4 text-sm border-r border-gray-200">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === "Completed" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                        {transaction.status}
                    </span>
                    </td>
                    <td className="p-4 text-sm">
                    <button className="text-blue-600 hover:underline">View Invoice</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}