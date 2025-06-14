import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  className = '',
  required = false,
  disabled = false,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className={`
          absolute left-3 transition-all duration-200 pointer-events-none
          ${focused || hasValue 
            ? 'top-0 text-xs text-primary bg-white px-1 -translate-y-1/2' 
            : 'top-1/2 text-sm text-surface-500 -translate-y-1/2'
          }
        `}>
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
<div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <ApperIcon name={icon} size={16} className="text-surface-400" />
          </div>
        )}
        
        {/* Input element - MUST remain self-closing (void element) */}
        <input
          type={type}
          placeholder={focused ? placeholder : ''}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`
            w-full px-3 py-3 border rounded-md transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error 
              ? 'border-error focus:border-error focus:ring-error/20' 
              : 'border-surface-300 focus:border-primary focus:ring-primary/20'
            }
            focus:outline-none focus:ring-2
            disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed
            ${!label ? 'placeholder-surface-400' : ''}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-xs text-error flex items-center">
          <ApperIcon name="AlertCircle" size={12} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;