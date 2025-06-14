import Input from '@/components/atoms/Input';

const FormField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  type = 'text',
  required = false,
  ...props 
}) => {
  return (
    <div className="space-y-1">
      <Input
        label={label}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        error={error}
        required={required}
        {...props}
      />
    </div>
  );
};

export default FormField;