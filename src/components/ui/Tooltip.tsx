import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip = ({ text, children, position = 'top' }: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-3';
      case 'right':
        return 'top-1/2 left-full transform -translate-y-1/2 ml-3';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-3';
      case 'left':
        return 'top-1/2 right-full transform -translate-y-1/2 mr-3';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-3';
    }
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="focus:outline-none"
      >
        {children}
      </div>
      {visible && (
        <div className={`absolute z-[9999] ${getPositionClasses()} bg-gray-800 text-white text-xs rounded py-2 px-3 whitespace-nowrap transition-opacity duration-300`}>
          {text}
          <div className={`absolute w-2 h-2 bg-gray-800 rotate-45 ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2' : position === 'right' ? 'left-0 top-1/2 -translate-y-1/2' : position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2' : 'right-0 top-1/2 -translate-y-1/2'}`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;