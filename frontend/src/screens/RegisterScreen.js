import React, { useState, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Components/Message';
import Loading from '../Components/Loader'
import { register } from '../actions/userActions'
import FormContainer from '../Components/FormContainer';

const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null)
    const dispatch = useDispatch();

    const userRegister = useSelector(state => state.userRegister)
    const {loading, error, userInfo} = userRegister
    
    const location = useLocation()
    const redirect = location.search ? location.search.split('=')[1] : '/';

    const navigate = useNavigate()
    
    const submitHandler = (e) => { 
        e.preventDefault();
        //dispatch register function
        if (password !== confirmPassword) {
            setMessage('password is not match')
        } else { 
            dispatch(register(name, email, password))
        }
    }
    
    useEffect(() => { 
        if (userInfo) { 
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    return (
    <div>
        <FormContainer>
            <h1>Register</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loading />}
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
                    Sign up
                </Button>
            </Form>
            <Row className='py-3'>
                <Col>
                    Exist User? <Link to={ redirect ? `/login?redirect=${redirect}` : '/register'}>Login</Link>
                </Col>
            </Row>
        </FormContainer>
    </div>
  )
}

export default RegisterScreen
