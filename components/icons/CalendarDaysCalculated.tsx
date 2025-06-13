import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  dayNumber?: string | number;
}

const CalendarDaysCalculated: React.FC<IconProps> = ({
  size = 25,
  color = "#D27A08",
  className,
  dayNumber = "07" // Default value
}) => {
  // Format the number to always show 2 digits
  const formattedNumber = typeof dayNumber === 'number' 
    ? dayNumber.toString().padStart(2, '0')
    : dayNumber.length === 1 
      ? `0${dayNumber}`
      : dayNumber;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 28 26" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Calendar outline */}
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M11.0001 1C11.0001 0.447715 10.5524 0 10.0001 0C9.4478 0 9.00008 0.447715 9.00008 1V1.33333H7.33386C4.20425 1.33333 1.66719 3.87039 1.66719 7V11.8087C1.66719 13.7729 1.255 15.7152 0.457268 17.5101C-0.225932 19.0473 0.407405 20.7259 1.69402 21.5254C1.95658 24.0399 4.08275 26 6.66675 26H22.0001C25.1297 26 27.6667 23.4629 27.6667 20.3333V13.476C27.667 13.4362 27.6672 13.3965 27.6672 13.3567V7C27.6672 3.87039 25.1301 1.33333 22.0005 1.33333H20.3334V1C20.3334 0.447715 19.8857 0 19.3334 0C18.7811 0 18.3334 0.447715 18.3334 1V1.33333H11.0001V1ZM9.00008 3.33333V3.66667C9.00008 4.21895 9.4478 4.66667 10.0001 4.66667C10.5524 4.66667 11.0001 4.21895 11.0001 3.66667V3.33333H18.3334V3.66667C18.3334 4.21895 18.7811 4.66667 19.3334 4.66667C19.8857 4.66667 20.3334 4.21895 20.3334 3.66667V3.33333H22.0005C24.0256 3.33333 25.6672 4.97496 25.6672 7L25.6667 13.4683C25.6589 14.4501 25.5476 15.4285 25.3345 16.3872C24.8654 18.4981 22.9932 20 20.8308 20H3.37512C2.51176 20 1.93424 19.1113 2.28489 18.3224C3.19628 16.2718 3.66719 14.0527 3.66719 11.8087V7C3.66719 4.97496 5.30882 3.33333 7.33386 3.33333H9.00008ZM25.6667 20.3333V19.8981C24.4481 21.2034 22.7164 22 20.8308 22H3.83745C4.24929 23.1652 5.36053 24 6.66675 24H22.0001C24.0251 24 25.6667 22.3584 25.6667 20.3333Z" 
        fill={color}
      />
      
      {/* Dynamic number display */}
      <text 
        x="50%" 
        y="52%" 
        dominantBaseline="middle" 
        textAnchor="middle" 
        fill={color}
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fontWeight="bold"
      >
        {formattedNumber}
      </text>
    </svg>
  );
};

export default CalendarDaysCalculated;