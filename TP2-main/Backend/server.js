const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Endpoint de prueba para la conectividad
app.get('/api/status', (req, res) => {
  res.json({ status: 'Online', message: 'Conectividad MERN establecida' });
});

module.exports = app; // Exportamos para las pruebas TDD