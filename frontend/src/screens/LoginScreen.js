import React, { useState, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Components/Message';
import Loading from '../Components/Loader'
import { login } from '../actions/userActions'
import FormContainer from '../Components/FormContainer';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.userLogin)
    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;
    const {loading, error, userInfo} = userLogin
    
    const location = useLocation()
    const redirect = location.search ? location.search.split('=')[1] : '/';
    
    const navigate = useNavigate();
    
    const submitHandler = (e) => { 
        e.preventDefault();
        //dispatch login function
        dispatch(login(email, password))
    }
    
    useEffect(() => { 
        if (userInfo) { 
            navigate(redirect)
        }
        else if(userInfo && cartItems.length !== 0) navigate('/shipping')
    }, [navigate, userInfo, redirect, cartItems])
    return (
    <div>
        <FormContainer>
            <h1>Login</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loading />}
            <Form onSubmit={submitHandler}>
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
                 <Button type='submit' variant='primary' className='my-4'>
                    Login 
                </Button>
            </Form>
            <Row className='py-3'>
                <Col>
                    New User? <Link to={ redirect ? `/register?redirect=${redirect}` : '/register'}>Sign up</Link>
                </Col>
            </Row>
        </FormContainer>
    </div>
  )
}

export default LoginScreen
