import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keyword' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
    title: 'Welcome to Duoduo Mobile Shop',
    description: 'shopping',
    keywords: 'E-commerce Mobile platform'
}

export default Meta

