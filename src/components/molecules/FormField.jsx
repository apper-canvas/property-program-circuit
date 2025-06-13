import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const FormField = ({ label, id, type = 'text', value, onChange, placeholder, className = '', labelClassName = '', inputClassName = '', required = false, ...rest }) => {
  return (
    <div className={className}>
      <Text as="label" htmlFor={id} className={`block text-sm font-medium text-gray-700 mb-2 ${labelClassName}`}>
        {label} {required && '*'}
      </Text>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={inputClassName}
        {...rest}
      />
    </div>
  );
};

export default FormField;