
// controllers/orderController.js
const OrderService = require('../services/orderService');
const Order = require('../models/orderModel'); // Asegúrate de que la ruta sea correcta

// Función para validar los datos de entrada de la orden
const validateOrderData = (data) => {
    const { user_id, item_id, payment } = data;
    let missingFields = [];

    if (!user_id) missingFields.push('user_id');
    if (!item_id) missingFields.push('item_id');
    if (!payment) {
        missingFields.push('payment');
    } else {
        if (!payment.method) missingFields.push('payment.method');
        if (!payment.card_number) missingFields.push('payment.card_number');
        if (!payment.valid_at) missingFields.push('payment.valid_at');
        if (!payment.document_number) missingFields.push('payment.document_number');
    }
    return missingFields;
};

/*const createOrder = async (req, res) => {
    try {
        const missingFields = validateOrderData(req.body);
        if (missingFields.length > 0) {
            return res.status(400).json({ error: 'Missing required fields', missingFields });
        }

        const { user_id, item_id, discount_id, payment } = req.body;
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Authorization token is required' });
        }

        const order = await OrderService.createOrder(user_id, item_id, discount_id, payment, token);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};*/
const createOrder = async (req, res) => {
    try {
        const missingFields = validateOrderData(req.body);
        if (missingFields.length > 0) {
            return res.status(400).json({ error: 'Missing required fields', missingFields });
        }

        const { user_id, item_id, discount_id, payment } = req.body;
/*        
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: 'Authorization token is required' });
        }*/

        // Simulación de validación de usuario (usamos datos fijos)
        const user = {
            id: user_id,
            name: 'Test User',
            email: 'testuser@example.com'
        };

        // Simulación de validación de ítem (usamos datos fijos)
        const item = {
            id: item_id,
            name: 'Test Item',
            price: 100 // Precio fijo
        };

        // Simulación de validación de descuento (usamos datos fijos)
        let discount = null;
        if (discount_id) {
            discount = {
                id: discount_id,
                rate: 0.1, // 10% de descuento
                is_active: true
            };
        }

        // Simulación de procesamiento de pago (usamos datos fijos)
        const paymentInfo = {
            method: payment.method,
            card_number: payment.card_number,
            valid_at: payment.valid_at,
            document_number: payment.document_number
        };

        let price = item.price;

        // Aplicar descuento si es que existe
        if (discount && discount.is_active) {
            price -= price * discount.rate;
        }

        // Crear el pedido con los datos fijos
        const newOrder = new Order({
            user_id: user_id,
            item_id: item_id,
            discount_id: discount_id,
            payment: paymentInfo,
            total_amount: price // Monto final después de aplicar cualquier descuento
        });

        await newOrder.save();

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const getOrdersByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const orders = await OrderService.getOrdersByUserId(user_id);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

module.exports = {
    createOrder,
    getOrdersByUserId,
    getAllOrders
};
