import { motion } from 'framer-motion';

const Button = ({ children, className = '', onClick, type = 'button', whileHover, whileTap, as: Component = 'button', ...rest }) => {
  const isMotionComponent = typeof Component === 'string' && Component.startsWith('motion.');
  const Comp = isMotionComponent ? motion[Component.replace('motion.', '')] : Component;

  const filteredProps = { ...rest };
  if (!isMotionComponent) {
    delete filteredProps.whileHover;
    delete filteredProps.whileTap;
  }

  return (
    <Comp
      type={type}
      className={className}
      onClick={onClick}
      {...(isMotionComponent && whileHover ? { whileHover } : {})}
      {...(isMotionComponent && whileTap ? { whileTap } : {})}
      {...filteredProps}
    >
      {children}
    </Comp>
  );
};

export default Button;