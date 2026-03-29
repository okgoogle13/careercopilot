import React from 'react';

// Simple motion element factory
function createMotionElement(tag: string) {
  return React.forwardRef(function MotionStub({ children, ...props }: any, ref: any) {
    const safeProps: any = {};
    const badProps = new Set([
      'initial',
      'animate',
      'exit',
      'transition',
      'variants',
      'whileHover',
      'whileTap',
      'whileFocus',
      'whileDrag',
      'layout',
      'layoutId',
      'drag',
      'dragConstraints',
      'dragElastic',
      'custom',
    ]);
    for (const key of Object.keys(props)) {
      if (!badProps.has(key) && !key.startsWith('onAnimation') && !key.startsWith('onDrag')) {
        safeProps[key] = props[key];
      }
    }
    return React.createElement(tag, { ...safeProps, ref }, children);
  });
}

export const motion = {
  div: createMotionElement('div'),
  span: createMotionElement('span'),
  button: createMotionElement('button'),
  section: createMotionElement('section'),
  header: createMotionElement('header'),
  ul: createMotionElement('ul'),
  li: createMotionElement('li'),
  p: createMotionElement('p'),
  img: createMotionElement('img'),
  a: createMotionElement('a'),
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => children as any;
export const useAnimation = () => ({ start: jest.fn(), stop: jest.fn(), set: jest.fn() });
export const useMotionValue = (initial: any) => ({ get: () => initial, set: jest.fn() });
export const useTransform = (_v: any, _from: any, _to: any) => 0;
export const useSpring = (val: any) => val;
export const animate = jest.fn();
export const useInView = () => [jest.fn(), false];
export const LayoutGroup = ({ children }: any) => children;
export const LazyMotion = ({ children }: any) => children;
export const domAnimation = {};

export type HTMLMotionProps<_T extends keyof JSX.IntrinsicElements = 'div'> =
  React.HTMLAttributes<HTMLElement>;
export type MotionProps = React.HTMLAttributes<HTMLElement>;
export type Variants = Record<string, any>;

export default { motion, AnimatePresence };
