import React, { useEffect} from 'react';
import { Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { Carousel, Image } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { listTopProducts } from '../actions/productActions';


const ProductsCarousel = () => {
    const dispatch = useDispatch();
    const productTopRated = useSelector((state) => state.productTopRated)
    const { loading, error, products } = productTopRated

    useEffect(() => {
        dispatch(listTopProducts())
    }, [dispatch])

    return (
        <div style={{marginBottom: '2rem'}}>
            {loading ? <Loader /> 
                : error
                    ? <Message variant='danger'>{error}</Message>
                    : <Carousel pause='hover' className='bg-dark'>
                        {products.map(product => (
                            <Carousel.Item key={product._id}>
                                <Link to={`/products/${product._id}`}>
                                    <Image src={product.image} alt={product.name} fluid  className="d-block w-20"/>
                                    <Carousel.Caption className='carousel-caption'>
                                        <h3 style={{color: '#fff'}}>{product.name} (￥{product.price})</h3>
                                    </Carousel.Caption>
                                </Link>
                            </Carousel.Item>
                        )) }
                    </Carousel>
            }
        </div>
    )
}

export default ProductsCarousel
