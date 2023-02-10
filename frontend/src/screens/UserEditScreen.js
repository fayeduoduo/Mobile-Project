import React, { useState, useEffect} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Components/Message';
import { getUserDetails, updateUser } from '../actions/userActions'
import FormContainer from '../Components/FormContainer';
import Loader from '../Components/Loader';
import { USER_UPDATE_REST } from '../constContent/userContents';

const UserEditScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false)
    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.userDetails)
    const {loading, error, user} = userDetails
    
    const userUpdate = useSelector(state => state.userUpdate)
    const {loading: loadingUpdate, error: errorUpdate, success: successUpdate} = userUpdate
    
    const params = useParams();
    const { id } = params;
    const userId = id;
    const navigate = useNavigate();
  
    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_REST })
            navigate('/admin/userlist')
        } else {
            if (!user.name || user._id !== userId) {
                dispatch(getUserDetails(userId))
            } else {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }
        }
    },[dispatch, user, userId, successUpdate, navigate])

    const submitHandler = (e) => { 
        e.preventDefault();
        dispatch(updateUser({
            _id: userId, email, name, isAdmin
        }))
    }

    return (
    <div>
        <FormContainer>
            <Link to='/admin/userlist' className='=/btn btn-dark my-3'
                    style={{color:'blue'}}>Back</Link>
                <h1 style={{ marginTop: '10px' }}>Edit User Info</h1>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {loading
                ? <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                    :
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
                        <Form.Group controlId="isAdmin" className='my-4'>
                            <Form.Check type='checkbox'
                                    label ='is admin'
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}>
                            </Form.Check>
                        </Form.Group>
                        <Button type='submit' variant='primary' className='my-4'>
                            Update
                        </Button>
                    </Form>
            }
        </FormContainer>
    </div>
  )
}

export default UserEditScreen