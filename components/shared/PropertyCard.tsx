interface PropertyDetailsProps {
  buildingName: string;
  propertyType: string;
  propertySize: string;
}
const PropertyCard = ({ buildingName, propertyType, propertySize }: PropertyDetailsProps) => {
  return (
    <div className="w-full bg-white rounded-lg border border-[#DBDCDF] p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Property Details
      </h2>
      <hr className="border-gray-300 mb-4" />
      <div className="flex text-gray-700">
        <div className="w-1/3">
          <p className="font-medium text-sm text-gray-500">Adress</p>
          <p>{buildingName}</p>
        </div>
        <div className="w-1/3">
          <p className="font-medium text-sm text-gray-500">Property Type</p>
          <p>{propertyType}</p>
        </div>
        <div className="w-1/3">
          <p className="font-medium text-sm text-gray-500">Square Footage</p>
          <p>{propertySize}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;