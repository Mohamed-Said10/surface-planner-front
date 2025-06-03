import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock data structure - replace with your actual booking data
const booking = {
  photographer: {
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+971 50 123 4567",
  },
  totalCost: 700,
  paidAmount: 500,
  payments: [
    {
      id: "120894",
      datePaid: "March 3, 2025, 2:00 PM",
      amount: 500,
      method: "Credit Card",
      status: "Paid",
    },
    {
      id: "120895",
      datePaid: "March 4, 2025, 3:00 PM",
      amount: 200,
      method: "Paypal",
      status: "Failed",
    },
  ],
}

export default function Payement_Details() {
  return (
    <div className="space-y-6 mx-auto">
      {/* Photographer Details - Dynamic
      {booking.photographer && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Photographer Details</h2>
            <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">View Portfolio →</button>
          </div>

          <hr className="h-px bg-gray-200 mb-4" />
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Name</h3>
              <p className="text-sm font-medium">
                {booking.photographer.firstname} {booking.photographer.lastname}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Email</h3>
              <p className="text-sm font-medium">{booking.photographer.email}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Phone</h3>
              <p className="text-sm font-medium">{booking.photographer.phoneNumber}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Location</h3>
              <p className="text-sm font-medium">Dubai UAE</p>
            </div>
          </div>
        </div>
      )} */}

      {/* Payment Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Payment Details</h2>
          <Button variant="outline" className="text-sm flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Invoice
          </Button>
        </div>
                <div className="dvideligne border-b  mb-3 mt-3"/>


        {/* Payment Summary */}
        <div className="grid grid-cols-2 gap-8  ">
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Total Booking Cost</h3>
            <p className="text-lg font-semibold">${booking.totalCost}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Paid</h3>
            <p className="text-lg font-semibold">${booking.paidAmount}</p>
          </div>
        </div>
                        <div className="dvideligne border-b  mb-3 mt-3"/>

        {/* Payment Table */}
        <div className="overflow-hidden rounded-lg border border-[#E0E0E0]">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0] first:rounded-tl-lg">
                  Payment ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">
                  Date Paid
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">
                  Payment Method
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] last:rounded-tr-lg">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {booking.payments.map((payment, index) => (
                <tr
                  key={payment.id}
                  className={`border-t border-[#E0E0E0] ${index === booking.payments.length - 1 ? "last-row" : ""}`}
                >
                  <td
                    className={`py-4 px-4 text-sm font-medium border-r border-[#E0E0E0] ${index === booking.payments.length - 1 ? "rounded-bl-lg" : ""}`}
                  >
                    {payment.id}
                  </td>
                  <td className={`py-4 px-4 text-sm text-gray-600 border-r border-[#E0E0E0]`}>{payment.datePaid}</td>
                  <td className={`py-4 px-4 text-sm font-medium border-r border-[#E0E0E0]`}>${payment.amount}</td>
                  <td className={`py-4 px-4 text-sm text-gray-600 border-r border-[#E0E0E0]`}>{payment.method}</td>
                  <td className={`py-4 px-4 ${index === booking.payments.length - 1 ? "rounded-br-lg" : ""}`}>
                    <Badge
                      variant={payment.status === "Paid" ? "default" : "destructive"}
                      className={payment.status === "Paid" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                    >
                      {payment.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
