import React from 'react';
import styles from './ConfirmTagsModal.module.css';
import { X } from 'lucide-react';

export interface ConfirmTagsModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  onConfirm?: (data: Record<string, string>) => void;
  fields?: Array<{ name: string; label: string; type?: string }>;
}

export const ConfirmTagsModal = React.forwardRef<HTMLDivElement, ConfirmTagsModalProps>(
  ({ open = false, onOpenChange, title = 'Confirm Tags', onConfirm, fields = [], className, ...props }, ref) => {
    const [formData, setFormData] = React.useState<Record<string, string>>({});

    const handleClose = () => onOpenChange?.(false);
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onConfirm?.(formData);
      handleClose();
    };

    if (!open) return null;

    return (
      <div className={styles['modal-overlay']} onClick={() => handleClose()}>
        <div className={styles['modal-paper']} onClick={(e) => e.stopPropagation()} ref={ref} {...props}>
          <div className={styles['modal-header']}>
            <h2 className={styles['modal-title']}>{title}</h2>
            <button className={styles['modal-close']} onClick={handleClose} type="button">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className={styles['modal-form']}>
            {fields.map(field => (
              <div key={field.name} className={styles['form-group']}>
                <label htmlFor={field.name} className={styles['form-label']}>{field.label}</label>
                <input
                  id={field.name}
                  type={field.type || 'text'}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className={styles['form-input']}
                />
              </div>
            ))}
            <div className={styles['modal-footer']}>
              <button type="button" className={styles['btn-cancel']} onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className={styles['btn-confirm']}>
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

ConfirmTagsModal.displayName = 'ConfirmTagsModal';
