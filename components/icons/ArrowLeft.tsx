import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const ArrowLeft: React.FC<IconProps> = ({ 
  size = 25,
  color = "#101828",
  className 
}) => {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 32 32" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M11.3578 8.5676C11.781 8.21284 12.4118 8.26838 12.7665 8.69166C13.1213 9.11493 13.0657 9.74566 12.6425 10.1004L6.7958 15.0007H26.6668C27.2191 15.0007 27.6668 15.4484 27.6668 16.0007C27.6668 16.553 27.2191 17.0007 26.6668 17.0007H6.79754L12.6426 21.901C13.0658 22.2558 13.1212 22.8866 12.7664 23.3098C12.4116 23.733 11.7809 23.7885 11.3576 23.4337L5.49989 18.5226C3.94473 17.2191 3.94466 14.7807 5.49989 13.4772L11.3578 8.5676Z" fill={color}/>
    </svg>
  );
};

export default ArrowLeft;