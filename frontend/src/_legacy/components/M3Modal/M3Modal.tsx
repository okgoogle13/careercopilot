import React from 'react';
import styles from './M3Modal.module.css';
import { X } from 'lucide-react';

export interface M3ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
}

const M3ModalContext = React.createContext({ onClose: () => {} });

export const M3Modal = React.forwardRef((props, ref) => {
  const { open = false, onOpenChange, title, children } = props;
  const handleClose = () => onOpenChange?.(false);

  if (!open) return null;

  return React.createElement(
    'div',
    { className: styles['modal-overlay'], onClick: () => handleClose() },
    React.createElement(
      M3ModalContext.Provider,
      { value: { onClose: handleClose } },
      React.createElement(
        'div',
        {
          className: styles['modal-paper'],
          onClick: (e) => e.stopPropagation(),
          ref: ref,
        },
        title && React.createElement(
          'div',
          { className: styles['modal-header'] },
          React.createElement('h2', { className: styles['modal-title'] }, title),
          React.createElement(
            'button',
            {
              className: styles['modal-close'],
              onClick: handleClose,
              type: 'button',
            },
            React.createElement(X, { size: 20 })
          )
        ),
        children
      )
    )
  );
});

M3Modal.displayName = 'M3Modal';

export const M3ModalContent = (props) =>
  React.createElement(
    'div',
    { ...props, className: styles['modal-content'] + (props.className ? ' ' + props.className : '') }
  );

export const M3ModalFooter = (props) =>
  React.createElement(
    'div',
    { ...props, className: styles['modal-footer'] + (props.className ? ' ' + props.className : '') }
  );
