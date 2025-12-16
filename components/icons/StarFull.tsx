import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const StarFull: React.FC<IconProps> = ({ size = 18, color = "#F79009", className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.4363 2.55563C9.82875 1.39812 8.17163 1.39812 7.5641 2.55563L6.0838 5.376C6.00929 5.51798 5.87083 5.61527 5.712 5.63727L2.63022 6.06403C1.28343 6.25053 0.750101 7.91188 1.7367 8.84745L3.96059 10.9563C4.08208 11.0715 4.13738 11.2402 4.1077 11.4049L3.56806 14.4009C3.33208 15.711 4.68773 16.7318 5.88162 16.143L8.78042 14.7134C8.91897 14.645 9.08142 14.645 9.21997 14.7134L12.1188 16.143C13.3127 16.7318 14.6683 15.711 14.4323 14.4009L13.8927 11.4049C13.863 11.2402 13.9183 11.0715 14.0398 10.9563L16.2637 8.84745C17.2503 7.91188 16.717 6.25053 15.3702 6.06403L12.2884 5.63727C12.1296 5.61527 11.9911 5.51798 11.9166 5.376L10.4363 2.55563Z"
      fill={color}
    />
  </svg>
);

export default StarFull;
