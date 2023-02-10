import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link,useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form} from 'react-bootstrap';
import Rating from '../Components/Rating';
import { listProductDetails, createProductReview } from '../actions/productActions';
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import { PRODUCT_CREATE_REVIEW_RESET, PRODUCT_DETAILS_RESET } from '../constContent/productContent';
import Meta from '../Components/Meta';


const ProductScreen = () => {
  //get rooter id；
  const params = useParams();
  const { id } = params;
 
  //use history to change page
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { productDetails, userLogin } = useSelector(state => state);
  const { loading, payload, product } = productDetails
  const { userInfo } = userLogin;
  
  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const {loading: loadingProductReview, success: successProductReview, error: errorProductReview,} = productReviewCreate


  //to set product quantity && review && comment
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (successProductReview) {
      alert('comment is successfully submited')
      setRating(0);
      setComment('');
    }
    if (!product._id || product._id !== id) {
      dispatch({ type: PRODUCT_DETAILS_RESET })
      dispatch(listProductDetails(id))
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
  }, [dispatch, id, successProductReview, product._id]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`)
  }
  
  const submitHandler = (e) => { 
    e.preventDefault();
    dispatch(createProductReview(id, {
      rating, comment,
    }))
  }

  return (
    <>
      <Link to='/' className='btn btn-dark rounded'>Back</Link>
      {loading ? <Loader />
        : payload
          ? <Message variant='danger'>{payload}</Message>
          : <div>
            <Meta title={product.name} />
            <Row>
              <Col md={6}>
                <Image src={product.image} alt={product.name} fluid/>
              </Col>
              <Col md={3}>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h3>{product.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating value={product.rating} text={`${product.numReviews} comments`} />
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p>Price: ￥{product.price}</p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p>{product.description}</p>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={3}>
                <Card>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <Row>
                        <Col>Price</Col>
                        <Col>
                          <strong>￥{product.price}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>In Stock: </Col>
                        <Col><strong>{ product.countInStock > 0 ? 'Yes' : 'sold out'}</strong></Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col className='mt-2'>Qunatity</Col>
                        <Col>
                           <Form.Control as='select'
                                      value={qty}
                                      onChange={(e) => {setQty(e.target.value)}}>
                              {[...Array(product.countInStock).keys()].map(i => { 
                                return (
                                    <option key={i + 1} value={i + 1} >{i + 1}</option>
                                  )
                                })
                              }
                           </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                    <Button className='btn-block'
                      disabled={product.countInStock === 0}
                      type='button' onClick={() =>addToCartHandler()}>Add to Cart
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
            <Row>
              {/* comment area */}
              <Col md={6}>
                <h3>Comments</h3>
                {product.reviews && product.reviews.length === 0 && (
                  <Message>No Comments</Message>
                )}
                <ListGroup variant='flush'>
                  {product.reviews &&
                    product.reviews.map((review) => (
                      <ListGroup.Item key={review._id}>
                        <strong>{review.name}</strong>
                        <Rating value={review.rating} style={{margin: "10px"} }/>
                        <p>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>
                      </ListGroup.Item>
                  ))}
                  <ListGroup.Item>
                    <h4>Add Comment</h4>
                    {loadingProductReview && <Loader />}
                    {errorProductReview && <Message variant='danger'>{ errorProductReview}</Message>}
                    {!userInfo
                      ? <Message>Please <Link to='/login'>login</Link></Message>
                      :
                      <Form onSubmit={submitHandler}>
                        <Form.Group>
                          <Form.Label>Score</Form.Label>
                          <Form.Control as='select'
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            style={{ marginBottom: '15px'}}>
                            <option value=''>Choose score</option>
                            <option value='1'>1--Very Dissatisfied</option>
                            <option value='2'>2--Dissatisfied</option>
                            <option value='3'>3--Ok</option>
                            <option value='4'>4--Satisfiedsatisified</option>
                            <option value='5'>5--Very Satisfied</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='comment' style={{marginTop: '10px', marginBottom:'10px'}}>
                          <Form.Control as='textarea'
                            row='3'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}>
                          </Form.Control>
                        </Form.Group>
                        <Button type='submit' variant='primary'>Submit</Button>
                      </Form>
                    }
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </div> 
      }
    </>
  )
}

export default ProductScreen
