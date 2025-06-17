"use client";
import React, { useState }from "react";
import { AverageCoins, XCircle, DollarSign, Download} from '@/components/icons';
import WithdrawEarningsModal from '@/components/modals/WithdrawEarningsModal';


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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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
      {/* <h1 className="text-2xl font-bold mb-6">Payments</h1> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Earnings Card */}
        <div className="bg-white border border-[#DBDCDF] rounded-lg p-4 flex items-center gap-3">
            <div className="p-3 border border-[#DBDCDF] rounded-md">
                <DollarSign size={25} />
            </div>
            <div>
                <div className="text-xs text-[#515662]">Total Earnings</div>
                <div className="text-xl font-semibold text-[#101828]">AED 57,000</div>
            </div>
        </div>

        {/* Average Earning per Booking Card */}
        <div className="bg-white border border-[#DBDCDF] rounded-lg p-4 flex items-center gap-3">
            <div className="p-3 border border-[#DBDCDF] rounded-md">
                <AverageCoins size={25} />
            </div>
            <div>
                <div className="text-xs text-[#515662]">Avg. Earning per Booking</div>
                <div className="text-xl font-semibold text-[#101828]">AED 127.5</div>
            </div>
        </div>

        {/* Failed Transactions Card */}
        <div className="bg-white border border-[#DBDCDF] rounded-lg p-4 flex items-center gap-3">
            <div className="p-3 border border-[#DBDCDF] rounded-md">
                <XCircle size={25} />
            </div>
            <div>
                <div className="text-xs text-[#515662]">Failed Transactions</div>
                <div className="text-xl font-semibold text-[#101828]">AED 4,000</div>
            </div>
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