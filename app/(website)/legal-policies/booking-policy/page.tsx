export default function BookingPolicyPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div>
          <h1 className="text-3xl font-bold ">
            Booking Policy
          </h1>
          <h2 className="text-xl font-medium  mt-4">
          1. Booking Confirmation
          </h2>
          <p className="mt-4 ">
          All bookings made through the Surfaceplanner dashboard are considered confirmed only
          once full payment has been successfully processed. Upon confirmation, you will receive a
          booking summary by email, including the package details, selected services, date, and time
          of the scheduled shoot.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-medium  mt-4">
          2. Booking Management
          </h2>
          <p className="mt-4 ">
          Clients are responsible for selecting the correct property type, preferred date, and time
          during the booking process. If specific access instructions or property limitations exist (gated
          communities, security codes, pets, etc.), these must be clearly mentioned in the “Additional
          Information” field.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-medium  mt-4">
          3. Preparation Requirements
          </h2>
          <p className="mt-4 ">
          Clients must ensure the property is fully prepared prior to the shoot. This includes: <br />
          <div className="ml-2 my-4">
            ● Lights turned on in all rooms <br />
            ● Curtains/blinds open <br />
            ● Personal belongings stored out of sight <br />
            ● Clean and clutter-free spaces <br />
            ● No third-party workers or owners obstructing the shoot <br />
          </div>
          Surfaceplanner photographers are not allowed to move or rearrange furniture under any
          circumstances.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-medium  mt-4">
          4. Rescheduling Policy
          </h2>
          <p className="mt-4 ">
          You may reschedule your booking free of charge if done <b>more than 24 hours in advance</b> of
          the scheduled shoot.<br />
          If the rescheduling request is made <b>less than 24 hours before the shoot</b>, a <b>rescheduling
          fee</b> will be charged to compensate for time reserved and logistical preparation.<br />
          Surfaceplanner reserves the right to reschedule or cancel a shoot in case of force majeure,
          unavailability of staff, or other unforeseen conditions.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-medium  mt-4">
          5. No-shows and Late Access
          </h2>
          <p className="mt-4 ">
            If the client fails to provide access to the property within <b>30 minutes</b> of the scheduled time,
            the booking will be marked as a <b>no-show</b> and no refund or reshoot will be issued.
          </p>
        </div>
      </div>
    </div>
  );
}