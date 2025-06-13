import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const Search: React.FC<IconProps> = ({
  size = 25,
  color = "#515662",
  className
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8.75008" cy="8.74996" r="7.08333" stroke="#93979E" stroke-width="1.5"/>
        <path d="M15.8806 17.2196L14.9703 15.7025C14.8444 15.4925 14.8774 15.2238 15.0506 15.0506C15.2238 14.8774 15.4925 14.8444 15.7025 14.9703L17.2196 15.8806C17.7641 16.2073 17.8566 16.9587 17.4076 17.4076C16.9587 17.8566 16.2073 17.7641 15.8806 17.2196Z" fill="#93979E" stroke="#93979E" stroke-width="1.5"/>
    </svg>
  );
};

export default Search;