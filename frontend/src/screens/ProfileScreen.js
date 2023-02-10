import React, { useState, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import { LinkContainer} from 'react-router-bootstrap'
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Components/Message';
import Loader from '../Components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrder } from '../actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../constContent/userContents';

const ProfileScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message] = useState(null)
    const dispatch = useDispatch();

    const { userDetails, userLogin, userUpdateProfile, orderListMy } = useSelector(state => state)
    const {loading, error, user} = userDetails
    const {userInfo} = userLogin
    const { success } = userUpdateProfile
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy
    // console.log(orders[0].paidAt.substring(0, 10))
    
    const navigate = useNavigate()

    useEffect(() => { 
        if (!userInfo) {
            navigate('/login')
        } else { 
            if (!user.name || success) {
                dispatch({type: USER_UPDATE_PROFILE_RESET})
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrder())
            } else { 
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [navigate, dispatch, userInfo, user, success])

        
    //update user form
    const submitHandler = (e) => { 
        e.preventDefault();
        //dispatch update profile
        dispatch(updateUserProfile({id: user._id, name, email, password }))
    }
    
    return (
        <Row>
            <Col md={3}>
                <h2>user profile</h2>
                {success && <Message variant='success'>update successfully!!</Message>}
                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className='my-4'>
                        <Form.Label>Name: </Form.Label>
                        <Form.Control type='name'
                                placeholder='please input name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="email" className='my-4'>
                        <Form.Label>Email: </Form.Label>
                        <Form.Control type='email'
                                placeholder='please input email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="password" className='my-4'>
                        <Form.Label>Password: </Form.Label>
                        <Form.Control type='password'
                                placeholder='please input password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="confirmPassword" className='my-4'>
                        <Form.Label>Confirm password: </Form.Label>
                        <Form.Control type='password'
                                placeholder='please confirm password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Button type='submit' variant='primary' className='my-4'>
                        Update
                    </Button>
                </Form>
            </Col>
            <Col md={9} className='px-5'>
                <h2>Order Summary</h2>
                {loadingOrders
                    ? <Loader />
                    : errorOrders 
                        ? <Message variant='danger'>{errorOrders}</Message>
                        : <Table striped bordered hover responsive size='sm' style={{textAlign: 'center', verticalAlign: 'middle'}}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>order Date</th>
                                    <th>Price</th>
                                    <th>Payment</th>
                                    <th>Deliver</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>{order.totalPrice}</td>
                                        <td>{order.isPaidAt
                                            ? <p style={{ color: 'green' }}>{order.paidAt}</p>
                                            : <i className='fas fa-times' style={{ color: 'red' }}></i>}
                                        </td>
                                        <td>{order.isDelivered
                                            ? <p style={{ color: 'green' }}>{order.deliveredAt}</p>
                                            : <i className='fas fa-times' style={{ color: 'red' }}></i>}
                                        </td>
                                        <td>
                                            <LinkContainer to={`/order/${order._id}`}>
                                                <Button size='sm' variant="secondary"> Details</Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                         </Table>
                }
            </Col>
        </Row>
  )
}

export default ProfileScreen
