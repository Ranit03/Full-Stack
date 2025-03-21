import React from 'react';

function BlackBackground() {
  return (
    <div style={{
      backgroundColor: '#000000',
      color: 'white',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px'
    }}>
      This should have a black background
    </div>
  );
}

export default BlackBackground;