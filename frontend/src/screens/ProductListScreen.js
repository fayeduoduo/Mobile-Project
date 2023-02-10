import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LinkContainer} from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Components/Message';
import Loader from '../Components/Loader';
import { createProduct, deleteProduct, listProducts } from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constContent/productContent';
import Paginate from '../Components/Paginate';


const ProductListScreen = () => {
    const dispatch = useDispatch();
    const { productList, userLogin, productDelete, productCreate } = useSelector(state => state);
    const { loading, error, products, pages, page } = productList
    const { userInfo } = userLogin
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete;
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct} = productCreate
    const navigate = useNavigate()
    const params = useParams();
    const pageNumber = params.pageNumber || 1;
    
    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET })
        if (!userInfo.isAdmin) { 
            navigate('/login')
        }
        if (successCreate) {
            //edit product page
            navigate(`/admin/product/${createdProduct._id}/edit`)
        } else { 
            dispatch(listProducts('', pageNumber))
        } 
    },[dispatch, navigate, userInfo, createdProduct, successDelete, successCreate, pageNumber])
    
    const deleteHandler = (id) => {
        if (window.confirm('are you sure')) { 
            //delete product
            dispatch(deleteProduct(id))
        }
    }

    const createProductHandler = () => { 
        dispatch(createProduct())
    }
  return (
    <> 
          <Row>
              <Col><h1 style={{ marginBottom: '10px' }}>Products</h1></Col>
              <Col className='text-right'><Button className='my-3 light' onClick={createProductHandler}>Add product</Button></Col>
          </Row>
          {loadingCreate && <Loader />}
          {errorCreate && <Message variant='danger'>{errorCreate}</Message>} 
          {loadingDelete && <Loader />}
          {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
          {loading
              ? <Loader />
              : error
                  ? <Message variant='danger'>{error}</Message> 
                  : (
                      <>
                        <Table striped bordered hover responsive className='sm' style={{textAlign: 'center', verticalAlign: 'middle'}}>
                          <thead>
                              <tr>
                                  <th>ID</th>
                                  <th>Name</th>
                                  <th>Price</th>
                                  <th>Category</th>
                                  <th>Brand</th>
                                  <th></th>
                              </tr>
                          </thead>
                          <tbody>
                              {products.map(product => (
                                  <tr key={product._id}>
                                      <td>{product._id}</td>
                                      <td>{product.name}</td>
                                      <td>￥{product.price}</td>
                                      <td>{product.category}</td>
                                      <td>{product.brand}</td>
                                      <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant='light' className='btn-sm'>
                                                <i className='fas fa-edit'></i>
                                            </Button>
                                        </LinkContainer>
                                        <Button variant='danger'
                                            className='btn-sm'
                                            onClick={() => deleteHandler(product._id)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                        </Table>
                          <Paginate page={page} pages={pages} isAdmin={true}/>
                    </>
                  )
            }
    </>
  )
}

export default ProductListScreen