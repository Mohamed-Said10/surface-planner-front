// components/icons/Checkmark.tsx
import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const Checkmark: React.FC<IconProps> = ({
  size = 32,
  color = "#12B76A",
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.3353 7.25671C27.7458 7.62617 27.7791 8.25846 27.4096 8.66897L13.3883 24.2482C12.5906 25.1346 11.1992 25.1303 10.4069 24.239L4.58561 17.69C4.21869 17.2772 4.25587 16.6452 4.66865 16.2782C5.08144 15.9113 5.71351 15.9485 6.08043 16.3613L11.9018 22.9103L25.9231 7.33104C26.2925 6.92053 26.9248 6.88726 27.3353 7.25671Z"
      fill={color}
    />
  </svg>
);

export default Checkmark;
