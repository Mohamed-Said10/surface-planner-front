export default function PaymentsAndRefundsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div>
          <h1 className="text-3xl font-bold ">
            Payment & Refund Policy – Surfaceplanner
          </h1>
          <h2 className="text-xl font-medium  mt-4">
            1. Payment Terms
          </h2>
          <p className="mt-4 ">
            All bookings must be paid in full via Surfaceplanner’s secure online platform at the time of
            confirmation.
            We accept: <br />
            <div className="ml-2 my-4">
              ● Major credit & debit cards <br />
              ● Apple Pay / Google Pay (if enabled) <br />
              ● Bank transfers (for enterprise clients) <br />
            </div>
            Your order is not confirmed until payment is completed
          </p>
        </div>
        <div>
          <h2 className="text-xl font-medium  mt-4">
            2. Invoicing
          </h2>
          <p className="mt-4 ">
            An invoice will be generated and accessible via your client dashboard immediately upon
            payment. All prices listed on Surfaceplanner are VAT-inclusive unless stated otherwise.
            Invoices include: <br />
            <div className="ml-2 my-4">
              ● Booking reference number <br />
              ● Client name and contact <br />
              ● Selected package(s) and add-ons <br />
              ● Date and time of the service <br />
            </div>
          </p>
        </div>
        <div>
          <h2 className="text-xl font-medium  mt-4">
            3. Refund Eligibility
          </h2>
          <p className="mt-4 ">
            Refunds are only issued under the following conditions:
            <br />
            <div className="ml-2 my-4">
              ● The client cancels the booking more than 24 hours in advance <br />
              ● Surfaceplanner fails to deliver the service due to internal issues or technical failure <br />
            </div>
            No refunds will be provided if: <br />

            <div className="ml-2 my-4">
              ● The client cancels or reschedules within 24 hours <br />
              ● The client fails to provide access to the property <br />
              ● The property is unprepared or not suitable for shooting <br />
              ● The client is dissatisfied with the outcome due to lack of preparation or unclear <br />
            </div>

            instructions
            Surfaceplanner may offer store credit or partial refunds at its discretion in specific cases.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-medium  mt-4">
            4. Chargebacks & Disputes
          </h2>
          <p className="mt-4 ">
            In the event of a payment dispute or chargeback, Surfaceplanner reserves the right to
            suspend access to any delivered media until the issue is resolved. Clients agree to contact
            us prior to initiating any formal dispute process.
          </p>
        </div>
      </div>
    </div>
  );
}