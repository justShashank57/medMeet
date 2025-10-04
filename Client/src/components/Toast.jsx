import React from 'react';

const ToastContext = React.createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const addToast = ({ message, type = 'info', duration = 5000 }) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        @media (max-width: 768px) {
          .toast-container {
            top: 10px;
            left: 10px;
            right: 10px;
          }
        }
      `}</style>
    </div>
  );
}

function Toast({ toast, onClose }) {
  const { message, type } = toast;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  return (
    <div className={`toast toast-${type}`} onClick={onClose}>
      <div className="toast-content">
        <div className="toast-icon">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'warning' && '⚠'}
          {type === 'info' && 'ℹ'}
        </div>
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
        ×
      </button>
      
      <style jsx>{`
        .toast {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 300px;
          max-width: 400px;
          cursor: pointer;
          animation: slideIn 0.3s ease-out;
          border-left: 4px solid;
        }

        .toast-success {
          border-left-color: #10b981;
        }

        .toast-error {
          border-left-color: #ef4444;
        }

        .toast-warning {
          border-left-color: #f59e0b;
        }

        .toast-info {
          border-left-color: #01B5C5;
        }

        .toast-content {
          display: flex;
          align-items: center;
          flex: 1;
          gap: 12px;
        }

        .toast-icon {
          font-size: 18px;
          font-weight: bold;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .toast-success .toast-icon {
          background: #10b981;
          color: white;
        }

        .toast-error .toast-icon {
          background: #ef4444;
          color: white;
        }

        .toast-warning .toast-icon {
          background: #f59e0b;
          color: white;
        }

        .toast-info .toast-icon {
          background: #01B5C5;
          color: white;
        }

        .toast-message {
          font-family: 'Quicksand', sans-serif;
          font-size: 14px;
          color: #374151;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          font-size: 18px;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
          margin-left: 8px;
          flex-shrink: 0;
        }

        .toast-close:hover {
          color: #374151;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .toast {
            min-width: auto;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
