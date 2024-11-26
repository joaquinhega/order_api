
// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Ruta para crear un nuevo pedido
router.post('/', orderController.createOrder);

// Ruta para obtener todos los pedidos de un usuario específico
router.get('/orders/:user_id', orderController.getOrdersByUserId);

// Ruta para obtener todos los pedidos en la base de datos (todos los usuarios)
router.get('/orders', orderController.getAllOrders);

module.exports = router;
