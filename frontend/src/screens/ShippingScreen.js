import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../Components/FormContainer';
import { saveShippingAddress } from '../actions/cartActions';
import ChekoutSteps from '../Components/ChekoutSteps';

const ShippingScreen = () => {
//get shipping address info
  const cart = useSelector(state => state.cart)
  const { shippingAddress } = cart;

  const [street, setStreet] = useState(shippingAddress.street);
  const [apt, setApt] = useState(shippingAddress.apt);
  const [city, setCity] = useState(shippingAddress.city);
  const [postcode, setPostCode] = useState(shippingAddress.postcode);
  const [province, setProvince] = useState(shippingAddress.province);
  const [country, setCountry] = useState(shippingAddress.country);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const submitHandler = (e) => { 
    e.preventDefault();
    dispatch(saveShippingAddress({ street, apt, city, province, postcode, country }))
    navigate('/payment')
  }

  return (
    <FormContainer>
      <ChekoutSteps step1 step2/>
      <h1>Shipping Address</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="street" className='my-4'>
          <Form.Label>Street: </Form.Label>
          <Form.Control type='street'
                        placeholder='please input street'
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="apt" className='my-4'>
          <Form.Label>Apt No.: </Form.Label>
          <Form.Control type='apt'
                        placeholder='please input apt no.'
                        value={apt}
                        onChange={(e) => setApt(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="city" className='my-4'>
          <Form.Label>City: </Form.Label>
          <Form.Control type='city'
                        placeholder='please input city'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="postcode" className='my-4'>
          <Form.Label>PostCode: </Form.Label>
          <Form.Control type='postcode'
                        placeholder='please input postcode'
                        value={postcode}
                        onChange={(e) => setPostCode(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="province" className='my-4'>
          <Form.Label>Province: </Form.Label>
          <Form.Control type='province'
                        placeholder='please input province'
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="country" className='my-4'>
          <Form.Label>Country: </Form.Label>
          <Form.Control type='country'
                        placeholder='please input country.'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}>
          </Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-4'>
          Next Step
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
