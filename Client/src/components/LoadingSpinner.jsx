import React from 'react';

function LoadingSpinner({ size = 'medium', color = '#01B5C5', text = 'Loading...' }) {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]}`}>
      <div className="spinner" style={{ borderTopColor: color }}></div>
      <p className="loading-text">{text}</p>
      <style jsx>{`
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-small { width: 40px; height: 40px; }
        .spinner-medium { width: 60px; height: 60px; }
        .spinner-large { width: 80px; height: 80px; }

        .loading-text {
          color: #666;
          font-family: 'Quicksand', sans-serif;
          font-size: 0.9rem;
          margin: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function InlineSpinner({ size = 'small' }) {
  const sizeClasses = {
    small: { width: '16px', height: '16px' },
    medium: { width: '24px', height: '24px' },
    large: { width: '32px', height: '32px' }
  };

  return (
    <div className="inline-spinner">
      <div className="spinner" style={{ 
        borderTopColor: '#01B5C5',
        width: sizeClasses[size].width,
        height: sizeClasses[size].height
      }}></div>
      <style jsx>{`
        .inline-spinner {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          border: 2px solid #f3f3f3;
          border-top-color: #01B5C5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner;
export { LoadingSpinner };