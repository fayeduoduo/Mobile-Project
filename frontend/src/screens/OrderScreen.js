import React, {useEffect, useState} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Col, Row, Image, Card, ListGroup, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, payOrders, deliverOrder } from '../actions/orderActions';
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import axios from 'axios';
import { ORDER_PAY_RESET } from '../constContent/orderContents';
import { PayPalButton } from 'react-paypal-button-v2';
import { ORDER_DELIVER_RESET } from '../constContent/orderContents';


const OrderScreen = () => {
    const params = useParams();
    const { id } = params;
    const orderId = id;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userLogin, orderDetails, orderPay, orderDeliver} = useSelector(state => state);
    const { order, loading, error } = orderDetails
    const { userInfo} = userLogin
    const { loading: loadingPay, success: successPay } = orderPay
    const { success: successDeliver } = orderDeliver;

    //payment image and textAlign: 
    const [text] = useState('Scan Code')

    //SDK
    const [SDK, setSDK] = useState(false);

    //pop up window
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false) };

    //set timing 
    const handlePayment = () => {
        setShow(true)
    }

    const successPaymentHandler = (paymentResult) => { 
        console.log(paymentResult)
        dispatch(payOrders(orderId, paymentResult))
    }

    //get total price
    if (!loading) { 
        const addDecimals = (num) => { 
            return (Math.round(num * 100) / 100).toFixed(2)
        }
        order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    }
    
    useEffect(() => {
        //dynamic set paypal script
        const addPayPalScript = async () => { 
            const { data: clientId } = await axios.get('/api/config/paypal')
            console.log(clientId)
            const script = document.createElement('script')
            script.type = 'text/javascript';
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
            script.async = true;

            script.onload = () => { 
                setSDK(true)
            }
            document.body.appendChild(script)
        }
        if (!userInfo) { 
            navigate('/login')
        }
        if (!order || order._id !== orderId || successPay || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) { 
            if (!window.paypal) {
                addPayPalScript()
            } else { 
                setSDK(true)
            }
        }
    }, [dispatch, orderId, order, successPay, navigate, userInfo, successDeliver])
    

    //set up btn
    const deliverHandler = () => { 
        dispatch(deliverOrder(order))
    }

    return (
        loading ? <Loader /> 
              : error
                ? <Message varaint='danger'>{error}</Message>
                : <>
                    <h1>Order No. {order._id}</h1>
                    <Row>
                        <Col md={8}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item className='mt-3'>
                                    <h4>Shipping Address</h4>
                                    <p>
                                        <strong style={{fontWeight: 'bold'}}>Receiver: </strong>
                                        {order.user.name}
                                    </p>
                                    <p><strong style={{fontWeight: 'bold'}}>Contact: </strong>
                                        <a href={`milto:${order.user.email}`}>{order.user.email}</a>
                                            
                                    </p>
                                    <p style={{ fontWeight: 'bold' }}>Delivering Address</p> 
                                    <span>
                                        {order.shippingAddress.street},
                                        {order.shippingAddress.apt},
                                        {order.shippingAddress.city},
                                        {order.shippingAddress.province},
                                        {order.shippingAddress.postcode},
                                        {order.shippingAddress.country}
                                        {order.isDelivered ?
                                                <Message variant='success'>Yes</Message>
                                                : <Message variant='danger'>Not Deliver</Message>
                                        }  
                                    </span>
                                </ListGroup.Item>
                                <ListGroup.Item className='mt-3'>
                                    <h4>Payment</h4>
                                    <p>Method: {order.paymentMethod}</p>
                                    {order.isPaid
                                        ? <Message variant='success'>{order.paidAt}</Message>
                                        : <Message variant='danger'>Need to pay</Message>
                                    }
                                </ListGroup.Item>
                                <ListGroup.Item className='mt-3'>
                                    <h4 style={{marginBottom: '1rem'}}>Order Summary</h4>
                                    {order.orderItems.length === 0
                                        ? <Message varaint='info'>Cart is Empty <Link to='/'>Go back to Shopping</Link></Message>
                                        : <ListGroup variant='flush'>
                                            {order.orderItems.map((item, k) => { 
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
                                            <Col>￥{order.itemsPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Shipping</Col>
                                            <Col>￥{order.shippingPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Total:</Col>
                                            <Col>￥{order.totalPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {/* paypal btn */}
                                    {!order.isPaid && order.paymentMethod === 'PayPal' && (
                                        <ListGroup.Item>
                                            {loadingPay && <Loader />}
                                            {!SDK ? <Loader />
                                                : <PayPalButton amount={order.totalPrice}
                                                        onSuccess={successPaymentHandler}></PayPalButton>}
                                        </ListGroup.Item>
                                    )}
                                    {/* WeChat btn */}
                                    {!order.isPaid && order.paymentMethod === 'Wechat' && 
                                        <ListGroup.Item>
                                            <Button type='button'
                                                className='btn-block'
                                                onClick={handlePayment}
                                                disabled={order.orderItems.length === 0}>Check Out
                                            </Button> 
                                            <Modal show={show} onHide={handleClose}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Order No. {order._id}</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <p>Total Price: ￥{order.totalPrice}</p>
                                                    <p>Payment Method: {order.paymentMethod}</p>
                                                    <Row>
                                                        <Col md={6} style={{textAlign:'center'} }>
                                                            <Image src='/images/wechat.jpg' />
                                                            <p style={{ backgroundColor: '#00c800', color: 'white' }}>
                                                                {text}
                                                            </p>
                                                        </Col>
                                                        <Col>
                                                            <Image src='/images/saoyisao.jpg' />
                                                        </Col>
                                                    </Row>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="primary" onClick={handleClose}>
                                                        Close
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </ListGroup.Item>
                                    }
                                    {/* deliver btn */}
                                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered
                                        && (<ListGroup.Item>
                                            <Button type='btn'
                                                className='btn-block'
                                                onClick={deliverHandler}
                                            > Deliver
                                            </Button>
                                        </ListGroup.Item>)
                                    }
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </>
    )
}

export default OrderScreen
