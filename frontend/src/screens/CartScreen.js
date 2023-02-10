import React from 'react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button, Card, ListGroup, Image} from 'react-bootstrap';
import { addToCart, removeFromCart } from '../actions/cartActions';
import Message from '../Components/Message';

const CartScreen = () => {
  //get rooter id；
  const params = useParams();
  const { id } = params;
  const productID = id;
  
  const location = useLocation();
  console.log(location)
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;
  //console.log(qty)
  
  //navigate to other page
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin
  const { cartItems } = cart;

  useEffect(() => {
    if (productID) { 
      dispatch(addToCart(productID, qty))
    }
  }, [dispatch, productID, qty])

  const removeFromCartHandeler = (id) => { 
    dispatch(removeFromCart(id))
  }
  
  //login ？ to shipping ： login
  const checkOut = () => { 
    if (!userInfo) navigate('/login');
    else navigate('/shipping')
  }

  return (
    <Row>
      <Col md={8}>
        <h1 className='mb-4'>Shopping Cart</h1>
        {cartItems.length === 0
          ? <Message>shopping cart is empty<Link to='/'>
            <span style={{marginLeft: '5px', color:'blue'}}>Back to Page</span></Link>
            </Message> 
          : <ListGroup variant='flush'>
            {
              cartItems.map(item => { 
                return (
                  <ListGroup.Item key={item.product}>
                    <Row>
                      <Col md={2}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                      <Col md={3} className='mt-4'>
                        <Link to={`/products/${item.id}`}>{item.name}</Link>
                      </Col>
                      <Col md={2} className='mt-4'>￥{item.price}</Col>
                      <Col md={2} className='mt-3'>
                        <Form.Control as='select'
                          value={item.qty}
                          onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                        >
                          {[...Array(item.countInStock).keys()].map(i => { 
                            return (
                              <option key={i+1} value={i + 1} >{i + 1}</option>
                              )
                            })
                          }
                        </Form.Control>
                      </Col>
                      <Col className='mt-3'>
                        <Button type='button' onClick={() => removeFromCartHandeler(item.product)}>
                          <i className='fas fa-trash'></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )
              })
            }
            </ListGroup>
        }
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Total Qty: {cartItems.reduce((acc, item) => acc + item.qty, 0)}</h2>
              <h4>Total Price: ￥{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)}</h4>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button type='button' className='btn-block'
                disabled={cartItems.length === 0 ? true : false}
                onClick={checkOut}
              >Check Out</Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen
