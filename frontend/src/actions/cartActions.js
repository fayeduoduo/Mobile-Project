import axios from 'axios';
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAV_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD } from '../constContent/cartContents';

export const addToCart = (id, qty) => async (dispatch, getState) => { 
    //getState is to use all state data
    const { data } = await axios.get(`/api/products/${id}`);
    
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty,
        }
    })

    //add product to local storage
    //getState will get full state 
    localStorage.setItem('CartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (id) => async (dispatch, getState) => { 
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    })
    //getState will get update state 
    localStorage.setItem('CartItems', JSON.stringify(getState().cart.cartItems))
}

//go to shipping address
//data to store shiiping info
export const saveShippingAddress = (data) => async (dispatch) => { 
    dispatch({
        type: CART_SAV_SHIPPING_ADDRESS,
        payload: data
    })
    //getState will get update state 
    localStorage.setItem('shippingAddress', JSON.stringify(data))
}

//save payment
export const savePaymentMethod = (data) => async (dispatch) => { 
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data
    })
    //getState will get update state 
    localStorage.setItem('paymentMethod', JSON.stringify(data))
}

