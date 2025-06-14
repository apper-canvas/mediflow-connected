import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary text-white hover:brightness-90 focus:ring-primary/50 disabled:bg-surface-300",
    secondary: "bg-secondary text-white hover:brightness-90 focus:ring-secondary/50 disabled:bg-surface-300",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary/50 disabled:border-surface-300 disabled:text-surface-400",
    ghost: "text-surface-700 bg-transparent hover:bg-surface-100 focus:ring-surface-300 disabled:text-surface-400",
    success: "bg-success text-white hover:brightness-90 focus:ring-success/50 disabled:bg-surface-300",
    danger: "bg-error text-white hover:brightness-90 focus:ring-error/50 disabled:bg-surface-300"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </motion.button>
  );
};

export default Button;