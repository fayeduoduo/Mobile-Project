import React, { useEffect } from 'react';
import { LinkContainer} from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Components/Message';
import Loader from '../Components/Loader';
import { listOrders} from '../actions/orderActions';
import { useNavigate } from 'react-router-dom';

const OrderListScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { orderList, userLogin } = useSelector(state => state);
    const { loading, error, orders } = orderList;
    const { userInfo } = userLogin;
    console.log(orderList)

    useEffect(() => {
        //solve the user is not admin, can't acess to userList page
        if (userInfo && userInfo.isAdmin) { 
            dispatch(listOrders())
        } else navigate('/login')
    }, [dispatch, userInfo, navigate])

  return (
    <> 
          <h1 style={{marginBottom:'10px'}}>Orders List</h1>
          {loading
              ? <Loader />
              : error
                  ? <Message variant='danger'>{error}</Message> 
                  : (
                      <Table striped bordered hover responsive className='table-sm' style={{textAlign:'center', verticalAlign:'middle'}}>
                          <thead>
                              <tr>
                                  <th>ID</th>
                                  <th>User</th>
                                  <th>Date</th>
                                  <th>Price</th>
                                  <th>Payment</th>
                                  <th>Deliver</th>
                              </tr>
                          </thead>
                          <tbody>
                              {orders.map(order => (
                                  <tr key={order._id}>
                                      <td>{order._id}</td>
                                      <td>{order.user && order.user.name}</td>
                                      <td>{(order.createdAt).substring(0, 10)}</td>
                                      <td>￥{order.totalPrice}</td>
                                      <td>{order.isPaid
                                          ? (order.paidAt.substring(0, 10))
                                          : <i className='fas fa-times' style={{color:'red'}}></i>
                                      }</td>
                                      <td>{order.isDelivered
                                          ? <p style={{ color: 'green' }}>Delivered</p>
                                          : <i className='fas fa-times' style={{color:'red'}}></i>
                                      }</td>
                                      <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button variant='light' className='btn-sm'>
                                                Check
                                            </Button>
                                        </LinkContainer>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </Table>
                  )
            }
    </>
  )
}

export default OrderListScreen