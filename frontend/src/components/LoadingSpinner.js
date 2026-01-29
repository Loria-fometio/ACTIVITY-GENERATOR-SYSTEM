// src/components/LoadingSpinner.js
import React from 'react';

function LoadingSpinner({ size = 'medium', text = 'Loading...' }) {
  const sizes = {
    small: { width: '20px', height: '20px' },
    medium: { width: '40px', height: '40px' },
    large: { width: '60px', height: '60px' }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div 
        style={{ 
          width: sizes[size].width,
          height: sizes[size].height,
          border: '4px solid rgba(0,0,0,0.1)',
          borderTopColor: '#2196F3',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '10px'
        }}
      />
      <p style={{ color: '#666', margin: 0 }}>{text}</p>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner;