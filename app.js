// app.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Conectar a MongoDB
connectDB();

// Middleware para CORS - debe ir antes de las rutas
app.use(cors({
    origin: 'http://localhost'  // Permitir el origen del cliente
}));
app.use(cors()); // Permitir cualquier origen en desarrollo

// Middleware para procesar datos JSON
app.use(bodyParser.json());

// Rutas
app.use('/api/v1', orderRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
