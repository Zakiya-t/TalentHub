import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        let icon = <Info size={18} style={{ color: 'var(--violet-light)' }} />;
        let className = 'toast toast-info';

        if (toast.type === 'success') {
          icon = <CheckCircle2 size={18} style={{ color: 'var(--status-emerald)' }} />;
          className = 'toast toast-success';
        } else if (toast.type === 'error') {
          icon = <AlertCircle size={18} style={{ color: 'var(--status-rose)' }} />;
          className = 'toast toast-error';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle size={18} style={{ color: 'var(--status-amber)' }} />;
          className = 'toast toast-warning';
        }

        return (
          <div key={toast.id} className={className}>
            <div style={{ flexShrink: 0, marginTop: 2 }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                color: '#64748b',
                padding: '0.2rem',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
