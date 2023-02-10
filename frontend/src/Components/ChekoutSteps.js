import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const ChekoutSteps = ({step1, step2, step3, step4}) => {
  return (
    <Nav className='justify-content-center mb-4'>
        {step1
            ? <LinkContainer to='/login'>
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            : <Nav.Link disabled>login</Nav.Link>
          }
        {step2
            ? <LinkContainer to='/shipping'>
                <Nav.Link>Shipping Address</Nav.Link>
              </LinkContainer>
            : <Nav.Link disabled>Shipping</Nav.Link>
          }
        {step3
            ? <LinkContainer to='/payment'>
                <Nav.Link>payment</Nav.Link>
              </LinkContainer>
            : <Nav.Link disabled>payment</Nav.Link>
          }
        {step4
            ? <LinkContainer to='/placeorder'>
                <Nav.Link>place order</Nav.Link>
              </LinkContainer>
            : <Nav.Link disabled>place order</Nav.Link>
        }
    </Nav>
  )
}

export default ChekoutSteps
