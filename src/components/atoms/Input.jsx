const Input = ({ type = 'text', value, onChange, placeholder, className = '', id, name, required = false, ...rest }) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent ${className}`}
      required={required}
      {...rest}
    />
  );
};

export default Input;