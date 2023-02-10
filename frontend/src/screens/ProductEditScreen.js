import React, { useState, useEffect} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Components/Message';
import { listProductDetails, updateProduct } from '../actions/productActions'
import FormContainer from '../Components/FormContainer';
import Loader from '../Components/Loader';
import { PRODUCT_UPDATE_RESET } from '../constContent/productContent';
import axios from 'axios';

const ProductEditScreen = () => {
    const params = useParams();
    const { id } = params;
    const productId = id;
    const dispatch = useDispatch();
    
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    const { productDetails, productUpdate } = useSelector(state => state)
    const { loading, error, product } = productDetails
    const { loading: loadingUpdate , error: errorUpdate, success:successUpdate } = productUpdate
    
    const navigate = useNavigate();
  
    useEffect(() => {
        if (successUpdate) { 
            dispatch({ type: PRODUCT_UPDATE_RESET })
            navigate('/admin/productlist')
        } else {
            if (!product.name || product._id !== productId) {
                dispatch(listProductDetails(productId))
            } else { 
                setName(product.name)
                setPrice(product.price)
                setBrand(product.brand)
                setCategory(product.category)
                setImage(product.image)
                setDescription(product.description)
                setCountInStock(product.countInStock)
            }
        }
    },[dispatch, navigate, productId, product, successUpdate])

    //upload file
    const uploadFileHandler = async(e) => { 
        //get file info ->every upoad will be one file
        const file = e.target.files[0];
        //instantiates the formdata
        const formData = new FormData();
        //append name -"image" must match to backend router.post-->upload.single "name" ("image")
        formData.append('image', file)
        setUploading(true)

        try {
            const config = {
                headers: {
                    "content-Type": 'multerpart/form-data'
                }
            }
            const { data} = await axios.post('/api/upload', formData, config);
            setImage(data) //update image path;
            setUploading(false)
        } catch (error) { 
            console.log(error)
            setUploading(false)
        }
    }

    const submitHandler = (e) => { 
        e.preventDefault();
        //dispatch update product
        dispatch(updateProduct({
            _id: product._id, name, price, brand, image, countInStock, description,category
        }))
    }

    return (
    <div>
        <FormContainer>
            <Link to='/admin/productlist' className='=/btn btn-dark my-3'
                    style={{color:'blue'}}>Back</Link>
            <h1 style={{ marginTop: '20px' }}>Edit Product</h1>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {loading
                ? <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                    :
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name" className='my-4'>
                            <Form.Label>Name </Form.Label>
                            <Form.Control type='name'
                                    placeholder='please input product name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="image" className='my-4'>
                            {uploading && <Loader />}
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                    type='file'
                                    controlId="formFile"
                                    className="mb-3 mt-3"
                                    label='choose upload file'
                                    onChange={uploadFileHandler}>      
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="price" className='my-4'>
                            <Form.Label>Price </Form.Label>
                            <Form.Control type='number'
                                    placeholder='please input price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="brand" className='my-4'>
                            <Form.Label>Brand </Form.Label>
                            <Form.Control type='text'
                                    placeholder='please input brand'
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="countInStock" className='my-4'>
                            <Form.Label>CountInStock </Form.Label>
                            <Form.Control type='number'
                                    placeholder='please input countInStock'
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}>
                            </Form.Control>
                            </Form.Group>
                        <Form.Group controlId="category" className='my-4'>
                            <Form.Label>Category </Form.Label>
                            <Form.Control type='text'
                                    placeholder='please input category'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="description" className='my-4'>
                            <Form.Label>Description </Form.Label>
                            <Form.Control type='text'
                                    placeholder='please input prouct details'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}>
                            </Form.Control>
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

export default ProductEditScreen