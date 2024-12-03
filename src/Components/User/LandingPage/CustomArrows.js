import React from 'react';
import { IoChevronForwardCircle, IoChevronBackCircle } from 'react-icons/io5';

const NextArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={`absolute top-1/2 transform -translate-y-1/2 right-4 bg-gray-800 text-white rounded-full p-2 cursor-pointer z-50 ${className}`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <IoChevronForwardCircle size={30} />
    </div>
  );
};

const PrevArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={`absolute top-1/2 transform -translate-y-1/2 left-4 bg-gray-800 text-white rounded-full p-2 cursor-pointer z-50 ${className}`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <IoChevronBackCircle size={30} />
    </div>
  );
};

export { NextArrow, PrevArrow };
