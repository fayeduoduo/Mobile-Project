import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const SearchBox = () => {
    const [keyword, setKeyword] = useState('')
    const navigate = useNavigate();


    const submitHandler = (e) => { 
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`)
        } else { 
            navigate('/')
        }
    }
    return (
        <Form onSubmit={submitHandler} className='flex'>
            <Form.Control type="text"
                placeholder="search product..."
                className='search'
                name='search'
                size='sm'
                onChange={(e) => setKeyword(e.target.value)}
            >
            </Form.Control>
            <Button type='submit' variant='outline-success'  size='sm'>submit</Button>
        </Form>
  )
}

export default SearchBox;
