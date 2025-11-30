import React from 'react';
import styles from './M3Alert.module.css';

export type M3AlertSeverity = 'success' | 'error' | 'warning' | 'info';

export interface M3AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  severity?: M3AlertSeverity;
  title?: string;
  action?: React.ReactNode;
}

export const M3Alert = React.forwardRef((props, ref) => {
  const { severity = 'info', title, children, className, action, ...rest } = props;

  return React.createElement(
    'div',
    {
      ref: ref,
      className: styles.alert + ' ' + styles['alert--' + severity] + (className ? ' ' + className : ''),
      role: 'alert',
      ...rest,
    },
    React.createElement(
      'div',
      { className: styles['alert-content'] },
      title && React.createElement('div', { className: styles['alert-title'] }, title),
      React.createElement('div', { className: styles['alert-message'] }, children)
    ),
    action && React.createElement('div', { className: styles['alert-action'] }, action)
  );
});

M3Alert.displayName = 'M3Alert';
