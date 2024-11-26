
// services/orderService.js
const Order = require('../models/orderModel');
const httpClient = require('../utils/httpClient');

const AUTH_SERVICE_URL = 'http://auth-service:3000/api/v1'; // URL del servicio de autenticación
const ITEM_SERVICE_URL = 'http://item-service:3000/api/v1'; // URL del servicio de ítems
const DISCOUNT_SERVICE_URL = 'http://discount-service:3000/api/v1'; // URL del servicio de descuentos
const PAYMENT_SERVICE_URL = 'http://payment-service:3000/api/v1'; // URL del servicio de pagos
const NOTIFICATION_SERVICE_URL = 'http://notification-service:3000/api/v1'; // URL del servicio de notificaciones

const createOrder = async (userId, itemId, discountId, payment, token) => {
    // Paso 1: Validar que el usuario exista usando la API de Usuarios
    const user = await validateUser(userId, token);

    // Paso 2: Validar que el ítem exista usando la API de Ítems y obtener la información del ítem
    const item = await validateItem(itemId);
    let price = item.data.price; // Obtener el precio del ítem para calcular el total del pedido

    // Paso 3: Si se proporciona un discount_id, validar el descuento usando la API de Descuentos
    let discount = null;
    if (discountId) {
        discount = await validateDiscount(discountId, itemId, userId);
        if (discount && discount.data.is_active) {
            const discountRate = discount.data.rate; // por ejemplo, 0.1 para un descuento del 10%
            price -= price * discountRate; // Aplicar el descuento al precio del ítem
        }
    }

    // Paso 4: Validar los atributos de pago y procesar el pago usando la API de Pagos
    const paymentInfo = await processPayment({ ...payment, amount: price });

    // Paso 5: Guardar el pedido en la base de datos con los detalles de pago
    const newOrder = new Order({
        user_id: userId,
        item_id: itemId,
        discount_id: discountId,
        payment: {
            method: paymentInfo.method,
            card_number: paymentInfo.card_number.slice(-4), // Guardar solo los últimos 4 dígitos
            valid_at: paymentInfo.valid_at,
            document_number: paymentInfo.document_number,
        },
        total_amount: price, // Monto final después de aplicar cualquier descuento
    });
    await newOrder.save();

    // Paso 6: Notificar al usuario sobre la creación del pedido usando la API de Notificaciones
    await sendNotification(userId, newOrder);

    // Paso 7: Devolver los datos del pedido creado
    return newOrder;
};

// Función para validar el usuario con la API de Usuarios
const validateUser = async (userId, token) => {
    try {
        const response = await httpClient.get(`${AUTH_SERVICE_URL}/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error('Falló la validación del usuario: El usuario no existe o no está autorizado');
    }
};

// Función para validar el ítem con la API de Ítems
const validateItem = async (itemId) => {
    try {
        const response = await httpClient.get(`${ITEM_SERVICE_URL}/items/${itemId}`);
        return response.data;
    } catch (error) {
        throw new Error('Item validation failed: Item does not exist');
    }
};

// Función para validar el descuento con la API de Descuentos
const validateDiscount = async (discountId, itemId, userId) => {
    try {
        const response = await httpClient.get(`${DISCOUNT_SERVICE_URL}/discounts/${discountId}`, {
            params: { itemId, userId }
        });
        return response.data;
    } catch (error) {
        throw new Error('Discount validation failed: Discount does not exist or is invalid');
    }
};

// Función para procesar el pago con la API de Pagos
const processPayment = async (payment) => {
    try {
        const response = await httpClient.post(`${PAYMENT_SERVICE_URL}/process`, payment);
        return response.data;
    } catch (error) {
        throw new Error('Payment processing failed');
    }
};

// Función para enviar una notificación con la API de Notificaciones
const sendNotification = async (userId, order) => {
    try {
        await httpClient.post(`${NOTIFICATION_SERVICE_URL}/notify`, {
            userId,
            orderId: order._id,
            message: 'Your order has been created successfully.'
        });
    } catch (error) {
        console.error('Notification failed');
    }
};

module.exports = {
    createOrder,
    getOrdersByUserId: async (userId) => {
        return await Order.find({ user_id: userId });
    },
    getAllOrders: async () => {
        return await Order.find({});
    }
};
