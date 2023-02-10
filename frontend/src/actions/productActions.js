import axios from "axios";
import {
    PRODUCT_CREATE_FAIL, PRODUCT_CREATE_REQUESTS, PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL, PRODUCT_CREATE_REVIEW_REQUESTS, PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_DELETE_FAIL, PRODUCT_DELETE_REQUESTS, PRODUCT_DELETE_SUCCESS,
    PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUESTS, PRODUCT_DETAILS_SUCCESS,
    PRODUCT_LIST_FAIL, PRODUCT_LIST_REQUESTS, PRODUCT_LIST_SUCCESS,
    PRODUCT_UPDATE_FAIL, PRODUCT_UPDATE_REQUESTS, PRODUCT_UPDATE_SUCCESS,
    PRODUCT_TOP_REQUESTS, PRODUCT_TOP_SUCCESS, PRODUCT_TOP_FAIL
} from "../constContent/productContent";

//through thunk comined async function
//get All Product action
export const listProducts = (keyword = '', pageNumber = '') => async (dispatch) => { 
    try {
        dispatch({
            type: PRODUCT_LIST_REQUESTS
        })
        const { data } = await axios.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`);
        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        })
    } catch (error) { 
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

//get one Product action
export const listProductDetails = (id) => async (dispatch) => { 
    try { 
        dispatch({ 
            type: PRODUCT_DETAILS_REQUESTS
        })
        const { data } = await axios.get(`/api/products/${id}`)

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })
    } catch(error) { 
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

//delete product -admin
export const deleteProduct = (id) => async (dispatch, getState) => { 
    try {
        dispatch({ type: PRODUCT_DELETE_REQUESTS })

        const { userLogin: { userInfo } } = getState();
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        await axios.delete(`/api/products/${id}`, config)
        dispatch({type: PRODUCT_DELETE_SUCCESS})
    } catch (error) { 
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

//create product -admin
export const createProduct = () => async (dispatch, getState) => { 
    try {
        dispatch({ type: PRODUCT_CREATE_REQUESTS })

        const { userLogin: { userInfo } } = getState();
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.post('/api/products', {}, config)
        dispatch({
            type: PRODUCT_CREATE_SUCCESS,
            payload: data
        })
    } catch (error) { 
        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

//create product -admin
export const updateProduct = (product) => async (dispatch, getState) => { 
    try {
        dispatch({ type: PRODUCT_UPDATE_REQUESTS })

        const { userLogin: { userInfo } } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.put(`/api/products/${product._id}`, product, config)
        dispatch({
            type: PRODUCT_UPDATE_SUCCESS,
            payload: data
        })
    } catch (error) { 
        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

//create product review -- login user 
export const createProductReview = (productId, review) => async (dispatch,getState) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_REQUESTS,
    })

    const {userLogin: { userInfo }} = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post(`/api/products/${productId}/reviews`, review, config)
    dispatch({ type: PRODUCT_CREATE_REVIEW_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}


//get product rank
export const listTopProducts= () => async (dispatch) => { 
    try {
        dispatch({ type: PRODUCT_TOP_REQUESTS })

        const { data } = await axios.get('/api/products/top')
        dispatch({
            type: PRODUCT_TOP_SUCCESS,
            payload: data
        })
    } catch (error) { 
        dispatch({
            type: PRODUCT_TOP_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}