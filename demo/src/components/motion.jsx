import { forwardRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const EASE = [0.32, 0.72, 0, 1];
export const SOFT_SPRING = { type: 'spring', stiffness: 210, damping: 26, mass: 0.85 };
export const SCENE_VIEWPORT = { once: true, amount: 0.18, margin: '0px 0px -6% 0px' };

const TAGS = {
  a: motion.a,
  article: motion.article,
  button: motion.button,
  div: motion.div,
  footer: motion.footer,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
  ul: motion.ul,
};

function elementFor(as) {
  return TAGS[as] ?? motion.div;
}

function sceneVariants(reduce, delay, stagger, direction) {
  return {
    hidden: {},
    show: {
      transition: reduce
        ? { delayChildren: 0, staggerChildren: 0 }
        : {
            delayChildren: delay,
            staggerChildren: stagger,
            staggerDirection: direction,
          },
    },
  };
}

function itemVariants(type, reduce, distance) {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.25 } },
      exit: { opacity: 0, transition: { duration: 0.18 } },
    };
  }

  const states = {
    lift: { opacity: 0, y: distance },
    left: { opacity: 0, x: -distance },
    right: { opacity: 0, x: distance },
    scale: { opacity: 0, scale: 0.98, y: distance / 3 },
    fade: { opacity: 0 },
    mask: { opacity: 0, y: '100%' },
  };

  return {
    hidden: states[type] ?? states.lift,
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: type === 'mask' ? 0.72 : 0.58, ease: EASE },
    },
    exit: {
      opacity: 0,
      y: type === 'left' || type === 'right' ? 0 : -distance / 3,
      transition: { duration: 0.26, ease: EASE },
    },
  };
}

export const Scene = forwardRef(function Scene(
  {
    as = 'div',
    children,
    className = '',
    delay = 0.04,
    stagger = 0.1,
    direction = 1,
    trigger = 'view',
    viewport = SCENE_VIEWPORT,
    ...props
  },
  ref,
) {
  const reduce = useReducedMotion();
  const Component = elementFor(as);
  const activation =
    trigger === 'mount'
      ? { animate: 'show' }
      : { whileInView: 'show', viewport };

  return (
    <Component
      ref={ref}
      initial="hidden"
      variants={sceneVariants(reduce, delay, stagger, direction)}
      {...activation}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
});

export function SceneItem({
  as = 'div',
  children,
  className = '',
  type = 'lift',
  distance = 20,
  variants,
  ...props
}) {
  const reduce = useReducedMotion();
  const Component = elementFor(as);

  return (
    <Component
      variants={variants ?? itemVariants(type, reduce, distance)}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

export function MaskReveal({ as = 'div', children, className = '', contentClassName = '' }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <SceneItem as={as} type="mask" className={contentClassName}>
        {children}
      </SceneItem>
    </div>
  );
}

export function SceneLine({ className = '' }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      variants={
        reduce
          ? itemVariants('fade', true, 0)
          : {
              hidden: { opacity: 0, scaleX: 0 },
              show: {
                opacity: 1,
                scaleX: 1,
                transition: { duration: 0.65, ease: EASE },
              },
            }
      }
      className={`block origin-left ${className}`}
    />
  );
}
