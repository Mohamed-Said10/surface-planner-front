
interface Props {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}
export default function CustomerCard({ firstName, lastName, phoneNumber, email }: Props) {
  return (
    <div className="bg-white border border-[#DBDCDF] rounded-lg p-6 w-full max-w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Customer Details
      </h2>
      <hr className="border-gray-300 mb-4" />
      <div className="flex text-sm text-gray-700">
        <div className="w-1/3">
          <p className="text-gray-400">Name</p>
          <p>{firstName} {lastName}</p>
        </div>
        <div className="w-1/3">
          <p className="text-gray-400">Phone</p>
          <p>{phoneNumber}</p>
        </div>
        <div className="w-1/3">
          <p className="text-gray-400">Email</p>
          <p>{email}</p>
        </div>
      </div>
    </div>
  );
}
