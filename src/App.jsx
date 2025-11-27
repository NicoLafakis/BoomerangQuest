import React from 'react';
import Game from './components/Game';

function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0a0f',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '100%',
        maxHeight: '100%',
        aspectRatio: '16/9',
        boxShadow: '0 0 50px rgba(100, 50, 150, 0.3)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <Game />
      </div>
    </div>
  );
}

export default App;
