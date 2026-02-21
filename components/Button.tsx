import React from 'react';
import { NEUMORPHIC_BASE_CLASSES, NEUMORPHIC_HOVER_CLASSES, COLORS } from '../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = `${NEUMORPHIC_BASE_CLASSES} transition-all duration-200 active:shadow-neumorphic-inset`;
  const hoverStyles = NEUMORPHIC_HOVER_CLASSES;
  
  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'py-3 px-6 text-xl';
      break;
    case 'md':
      sizeClasses = 'py-4 px-8 text-2xl';
      break;
    case 'lg':
    default:
      sizeClasses = 'py-5 px-10 text-3xl sm:py-6 sm:px-12 sm:text-4xl md:py-8 md:px-16 md:text-5xl'; // Larger for toddlers
      break;
  }

  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = `bg-[${COLORS.BLUE}] text-white font-bold`;
      break;
    case 'secondary':
      variantClasses = `bg-[${COLORS.YELLOW}] text-gray-800 font-bold`;
      break;
    case 'accent':
      variantClasses = `bg-[${COLORS.GREEN}] text-white font-bold`;
      break;
  }

  const widthClass = fullWidth ? 'w-full' : 'w-auto';

  return (
    <button
      className={`${baseStyles} ${hoverStyles} ${variantClasses} ${sizeClasses} ${widthClass} ${className} flex items-center justify-center`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;