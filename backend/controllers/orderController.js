import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js'

//@desc   place order:
//@route  POST/api/orders
//@access  private
const addOrderItems = asyncHandler(async (req, res) => { 
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('no order info')
    } else { 
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice
        })

        const createOrder = await order.save();
        res.status(201).json(createOrder)
    }
})  

//@desc   get order:
//@route  GET/api/orders
//@access  private
const getOrderById = asyncHandler(async (req, res) => {
    //populate -> fill with other info
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
        res.json(order)
    } else { 
        res.status(404)
        throw new Error('Can find order')
    }
})  

//@desc   get all orders
//@route  POST/api/orders/:id
//@access  private
const getOrders = asyncHandler(async (req, res) => { 
    //pupulate to get who order
    const orders = await Order.find({}).populate('user', 'id name');

    if (orders) {
        res.json(orders)
    } else { 
        res.status(404);
        throw new Error('can\'t find order')
    }
})

//@desc   update order info
//@route  PUT/api/orders/:id/pay
//@access  private
const updateOrderToPaid = asyncHandler(async (req, res) => { 
    //pupulate to get who order
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        }
        const updateOrder = await order.save();
        res.json(updateOrder)
    } else { 
        res.status(404);
        throw new Error('can\'t find order')
    }
})


//@des   get user order
//@route    GET/api/orders/myorders
//@access   private --user
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({user: req.user._id})
    res.json(orders)
})

//@des   update order delivered status
//@route    PUT/api/orders/:id/deliver
//@access   private --admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliverdAt = Date.now();
        const updatedOrder = await order.save();
        res.json(updatedOrder)
    } else { 
        res.status(404);
        throw new Error('can\'t find order')
    }
})

export { addOrderItems, getOrderById, getOrders, updateOrderToPaid, getMyOrders, updateOrderToDelivered}