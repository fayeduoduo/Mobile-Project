import React, {useEffect} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { Button, Row, Col, Image, Card, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../actions/orderActions';
import Message from '../Components/Message';
import ChekoutSteps from '../Components/ChekoutSteps';
import { ORDER_CREATE_RESET } from '../constContent/orderContents';
import { USER_DETAILS_RESET } from '../constContent/userContents';

const PlaceOrder = () => {
    const cart = useSelector(state => state.cart);
    const dispatch = useDispatch();

    const orderCreate = useSelector(state => state.orderCreate);
    const {order, success, error } = orderCreate;

    const navigate = useNavigate();
    useEffect(() => { 
        if (success) {
            navigate(`/order/${order._id}`)
            dispatch({ type: ORDER_CREATE_RESET })
            dispatch({type: USER_DETAILS_RESET})
        }
        //eslint-disable-next-line
    }, [navigate, success])

    const placeorderHandler = () => { 
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemPrices: cart.itemPrice,
            shippingPrice: cart.shippingPrice,
            totalPrice: cart.totalPrice
        }))
    }

    //get total price
    const addDecimals = (num) => { 
        return (Math.round(num * 100) / 100).toFixed(2)
    }
    cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    cart.shippingPrice = cart.cartItems.length !== 0 ? (cart.itemsPrice > 5000 ? 0 : 20) : addDecimals(0);
    cart.totalPrice = cart.cartItems.length !== 0 ? addDecimals(Number(cart.itemsPrice) + Number(cart.shippingPrice)) : addDecimals(0)
    
  return (
    <>
          <ChekoutSteps step1 step2 step3 step4 />
          <Row>
              <Col md={8}>
                  <ListGroup variant='flush'>
                      <ListGroup.Item className='mt-3'>
                          <h2>Shipping Address</h2>
                          <p>
                              <strong>Address Info:</strong>
                              {cart.shippingAddress.street},
                              {cart.shippingAddress.apt},
                              {cart.shippingAddress.city},
                              {cart.shippingAddress.province},
                              {cart.shippingAddress.postcode},
                              { cart.shippingAddress.country}
                          </p>
                      </ListGroup.Item>
                      <ListGroup.Item className='mt-3'>Payment Method: {cart.paymentMethod}</ListGroup.Item>
                      <ListGroup.Item className='mt-3'>
                          <h4 style={{marginBottom: '1rem'}}>Order Summary</h4>
                          {cart.cartItems.length === 0
                              ? <Message varaint='info'>Cart is Empty <Link to='/'>Go back to Shopping</Link></Message>
                              : <ListGroup variant='flush'>
                                  {cart.cartItems.map((item, k) => { 
                                      return (
                                          <ListGroup.Item key={k}>
                                              <Row>
                                                  <Col md={2}>
                                                      <Image src={item.image} alt={item.name} fluid rounded />
                                                  </Col>
                                                  <Col className='mt-3'>
                                                      <Link to={`/products/${item.product}`}>{ item.name}</Link>
                                                  </Col>
                                                  <Col md={4} className='mt-3'>
                                                      {item.qty} X {item.price} = {item.qty * item.price }
                                                  </Col>
                                              </Row>
                                          </ListGroup.Item>
                                      )
                                  })}
                              </ListGroup>
                           }
                      </ListGroup.Item>
                  </ListGroup>
              </Col>
              <Col md={4}>
                  <Card>
                      <ListGroup variant='flush' className='mt-3'>
                          <ListGroup.Item>
                              <h3>Order Summary</h3>
                          </ListGroup.Item>
                          <ListGroup.Item>
                              <Row>
                                  <Col>Products Price</Col>
                                  <Col>￥{cart.itemsPrice}</Col>
                              </Row>
                          </ListGroup.Item>
                          <ListGroup.Item>
                              <Row>
                                  <Col>Shipping</Col>
                                  <Col>￥{cart.shippingPrice}</Col>
                              </Row>
                          </ListGroup.Item>
                          <ListGroup.Item>
                              <Row>
                                  <Col>Total:</Col>
                                  <Col>￥{cart.totalPrice}</Col>
                              </Row>
                          </ListGroup.Item>
                          <ListGroup.Item>
                              {error && <Message variant='danger'>{error}</Message>}
                          </ListGroup.Item>
                          <ListGroup.Item>
                              <Button type='button'
                                  className='btn-block'
                                  onClick={placeorderHandler}
                                  disabled={cart.cartItems.length === 0}>Submit</Button>
                          </ListGroup.Item>
                      </ListGroup>
                  </Card>
              </Col>
          </Row>
    </>
  )
}

export default PlaceOrder
