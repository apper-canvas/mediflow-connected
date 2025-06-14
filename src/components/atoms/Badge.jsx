const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '' 
}) => {
  const variants = {
    default: 'bg-surface-100 text-surface-700',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    danger: 'bg-error text-white',
    info: 'bg-info text-white',
    scheduled: 'bg-info/10 text-info border border-info/20',
    completed: 'bg-success/10 text-success border border-success/20',
    cancelled: 'bg-error/10 text-error border border-error/20',
    pending: 'bg-warning/10 text-warning border border-warning/20',
    paid: 'bg-success/10 text-success border border-success/20',
    overdue: 'bg-error/10 text-error border border-error/20'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm'
  };

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${variants[variant]} ${sizes[size]} ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;