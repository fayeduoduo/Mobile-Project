import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../Components/FormContainer';
import { savePaymentMethod } from '../actions/cartActions';
import ChekoutSteps from '../Components/ChekoutSteps';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;
  
  if (!shippingAddress) {
    navigate('/shipping')
  }
  const [paymentMethod, setPaymentMethod] = useState('Wechat')

  const submiteHandler = (e) => { 
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder')
  }

  return (
    <FormContainer>
      <ChekoutSteps step1 step2 step3 />
      <h1>Payment Methods</h1>
      <Form onSubmit={submiteHandler}>
        <Form.Group>
          <Form.Label as='legend'>Methods</Form.Label>
          <Col>
            <Form.Check type='radio'
              label='WeChat'
              id='WeChat'
              name='paymentMethod'
              value='WeChat'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
          </Col>
          <Col>
            <Form.Check type='radio'
              label='PayPal'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
          </Col>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-4'>
            Next Step
        </Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen

