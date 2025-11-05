import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[var(--color-error)]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-[var(--primary)]" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-green-500/50';
      case 'error':
        return 'border-[var(--color-error)]/50';
      case 'warning':
        return 'border-yellow-500/50';
      case 'info':
        return 'border-[var(--primary)]/50';
    }
  };

  return (
    <div
      className={`
        pointer-events-auto
        p-4 rounded-[var(--radius-lg)]
        bg-[var(--surface-container-high)] backdrop-blur-[var(--glass-blur)]
        border-2 ${getBorderColor()}
        shadow-[var(--shadow-glow-aurora)]
        animate-in slide-in-from-right duration-300
        flex items-start gap-3
      `}
    >
      {getIcon()}

      <div className="flex-1 min-w-0">
        <h4 className="text-[var(--on-surface)]">{toast.title}</h4>
        {toast.description && (
          <p className="text-sm text-[var(--on-surface-variant)] mt-1">{toast.description}</p>
        )}
      </div>

      <button
        onClick={() => onClose(toast.id)}
        className="text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Helper function for easy toast usage
export const toast = {
  success: (title: string, description?: string, duration?: number) => {
    // This will be set by the provider
    return { type: 'success' as const, title, description, duration };
  },
  error: (title: string, description?: string, duration?: number) => {
    return { type: 'error' as const, title, description, duration };
  },
  warning: (title: string, description?: string, duration?: number) => {
    return { type: 'warning' as const, title, description, duration };
  },
  info: (title: string, description?: string, duration?: number) => {
    return { type: 'info' as const, title, description, duration };
  },
};
