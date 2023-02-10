import React from 'react'
import propTypes from 'prop-types';

const Rating = ({value, text, color}) => {
  return (
    <div className='rating'>
        <span>
            <i  style={{color}}
                className={
                    value >= 1
                    ? 'fas fa-star'
                    : value >= 0.5
                    ? 'fas fa-star-half-alt'
                          : 'far fa-star'} >
            </i>
            <i  style={{ color }}
                className={
                    value >= 2
                    ? 'fas fa-star'
                    : value >= 1.5
                    ? 'fas fa-star-half-alt'
                          : 'far fa-star'} >
            </i> 
            <i  style={{color}}
                className={
                    value >= 3
                    ? 'fas fa-star'
                    : value >= 2.5
                    ? 'fas fa-star-half-alt'
                          : 'far fa-star'} >
            </i> 
            <i  style={{color}}
                className={
                    value >= 4
                    ? 'fas fa-star'
                    : value >= 3.5
                    ? 'fas fa-star-half-alt'
                          : 'far fa-star'} >
            </i> 
            <i  style={{color}}
                className={
                    value >= 5
                    ? 'fas fa-star'
                    : value >= 4.5
                    ? 'fas fa-star-half-alt'
                    : 'far fa-star'} >
            </i>   
        </span>
        <span className='comments'>
            {text ? text : ''}
        </span>
    </div>
  )
}
Rating.defaultProps = {
  color: 'rgb(244, 212, 3)',
}

//setting variant 
Rating.propTypes = {
    value: propTypes.number,
    text: propTypes.string.isRequired,
    color: propTypes.string
}

export default Rating
