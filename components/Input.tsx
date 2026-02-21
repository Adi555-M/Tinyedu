import React from 'react';
import { NEUMORPHIC_BASE_CLASSES, NEUMORPHIC_PRESSED_CLASSES } from '../constants';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  size = 'lg',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = `${NEUMORPHIC_BASE_CLASSES} border-none outline-none focus:outline-none focus:${NEUMORPHIC_PRESSED_CLASSES} transition-shadow duration-200`;

  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'py-3 px-4 text-xl';
      break;
    case 'md':
      sizeClasses = 'py-4 px-5 text-2xl';
      break;
    case 'lg':
    default:
      sizeClasses = 'py-5 px-6 text-3xl sm:py-6 sm:px-8 sm:text-4xl md:py-8 md:px-10 md:text-5xl'; // Larger for toddlers
      break;
  }

  const widthClass = fullWidth ? 'w-full' : 'w-auto';

  return (
    <input
      type="text"
      className={`${baseStyles} ${sizeClasses} ${widthClass} ${className}`}
      {...props}
    />
  );
};

export default Input;