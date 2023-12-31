import { CART_ADD_ITEM, CART_CLEAR_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD, CART_SAV_SHIPPING_ADDRESS } from "../constContent/cartContents";

export const cartReducers = (state = { cartItems: [], shippingAddress: {} }, action) => { 
    switch (action.type) { 
        case CART_ADD_ITEM:
            const item = action.payload;
            //distugish add product is not same product in cart
            const existItem = state.cartItems.find(x => x.product === item.product)

            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(x => x.product === existItem.product ? item : x)
                }
            } else { 
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }
        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            }
        case CART_CLEAR_ITEM:
            return {...state, cartitems: []}
        case CART_SAV_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload
            }
        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            }
        default:
            return state
    }
}

