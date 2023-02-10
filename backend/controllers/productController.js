import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';


//asyncHandler to simplize try()catch() process
//@des ask all products
//@route    GET/api/products?keyword = ${keyword}
//@access   public
const getProducts = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword ? {
            name: {
                //not fully match,(can contains same string)
                $regex: req.query.keyword,
                //dont need to care lowcase or uppercase
                $options: 'i',
            }
        }: {};

    //every page to list products qty
    const pageSize = 8;
    //from frontend to get page Number, must set default 1 in case of negative page
    const page = Number(req.query.pageNumber) || 1;
    
    //get all products qty(include keyword)
    const count = await Product.countDocuments({ ...keyword });
    //skip to skip the number already get,then display next pay qty
    //the default skip is 0
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1))
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

//@des      single product
//@route    GET/api/products/:id
//@access   public
const getProductByID = asyncHandler(async (req, res) => { 
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error('not find this product')
    }
})

//@des      delet single product
//@route    DELETE/api/products/:id
//@access   private--admin
const deleteProduct = asyncHandler(async (req, res) => { 
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.remove();
        res.json('Delete Successfully')
    } else {
        res.status(404)
        throw new Error('not find this product')
    }
})

//@des      create single product
//@route    POST/api/products/:id
//@access   private--admin
const createProduct = asyncHandler(async (req, res) => {
    //set up product sample
    const product = new Product({
        name: 'sample product',
        price: 0,
        user: req.user.body,
        image: '/images/sample.jpg',
        brand: 'sample',
        category: 'sample type',
        countInStock: 0,
        numReviews: 0,
        rating: 0,
        description: 'sample description'
    })
    //save product sample type
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
})

//@des      update product
//@route    PUT/api/products/:id
//@access   private--admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, brand, image, countInStock, description, category } = req.body
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name
        product.image = image
        product.brand = brand
        product.description = description
        product.price = price
        product.countInStock = countInStock
        product.category = category

        const updatedProduct = await product.save();
        res.status(201).json(updatedProduct)
    } else { 
        res.status(404);
        throw new Error('can\'t find this product')
    }
    //save product sample type
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
})

//@des      create product reviews
//@route    POST/api/products/:id/reviews
//@access   private
const createProductReview = asyncHandler(async (req, res) => {
    const {rating, comment } = req.body
    const product = await Product.findById(req.params.id);

    if (product) {
        //one review == one user
        const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString())
        if (alreadyReviewed) {
            res.status(400)
            throw new Error('you already reviewed')
        } 
        //add comment
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment, 
            user: req.user._id
        }
        product.reviews.push(review)
        //update product review and ratings score
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;
        await product.save();
        res.status(201).json({ message: 'create successfully' })
    } else { 
        res.status(404);
        throw new Error('can\'t find this product')
    }


    //save product sample type
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
})


//@des   get rank of product
//@route    GET/api/products/top
//@access   public
const getTopProducts = asyncHandler(async (req, res) => {
    //limit to get quantity of product
    const products = await Product.find({}).sort({rating: -1}).limit(4);
    res.json(products)
})

export {getProductByID, getProducts, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts}