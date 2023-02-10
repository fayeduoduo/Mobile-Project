import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import Product from '../Components/Product';
import ProductsCarousel from '../Components/ProductsCarousel';
import { listProducts } from '../actions/productActions';
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import Paginate from '../Components/Paginate';
import { useParams } from 'react-router-dom';
import Meta from '../Components/Meta';



const HomeScreen = () => {
    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList)
    const { loading, payload, products, pages, page} = productList
    const params = useParams();
    const keyword = params.keyword;
    console.log(keyword)
    
    const pageNumber = params.pageNumber || 1;

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber))
    }, [dispatch, keyword, pageNumber])
    
    return (
        <>
            <Meta />
            {!keyword ? <ProductsCarousel /> : <Link to='/'><Button className='btn-dark'>Back</Button></Link>}
            <h1 style={{marginTop: '20px'}}>Products Display</h1>
            {loading
                ? <Loader />
                : payload
                    ? <Message variant='danger'>{payload} </ Message>
                    :
                    <>
                        <Row>
                            {products.map(item => { 
                                return (
                                    <Col sm={10} md={6} lg={4} xl={3} key={item._id}>
                                        <Product product={item} />
                                    </Col>
                                    )
                                })
                            }
                        </Row>
                        <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} style={{alignItems: 'center'}} />
                    </>
            }
        </>
  )
}

export default HomeScreen;
