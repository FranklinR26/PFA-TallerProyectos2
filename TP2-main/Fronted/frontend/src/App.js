import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('Conectando...');

  useEffect(() => {
    fetch('http://localhost:5000/api/status')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Error de conexión con Backend'));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Weverse Universitario: Sistema de Horarios</h1>
      <p>Estado del Backend: <strong>{message}</strong></p>
    </div>
  );
}

export default App;