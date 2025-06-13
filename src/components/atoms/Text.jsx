import { motion } from 'framer-motion';

const Text = ({ as: Component = 'p', children, className = '', motionProps, ...rest }) => {
  const isMotionComponent = Component.startsWith('motion.');
  const Comp = isMotionComponent ? motion[Component.replace('motion.', '')] : Component;

  return (
    <Comp className={className} {...(isMotionComponent ? motionProps : {})} {...rest}>
      {children}
    </Comp>
  );
};

export default Text;