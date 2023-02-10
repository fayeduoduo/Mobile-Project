//provide data to data library
import mongoose from "mongoose";
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import products from './data/products.js'
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from "./config/db.js";

dotenv.config();
connectDB(); 

//insert data example to data library
const importData = async () => { 
    try {
        //empty example exist-data in data library
        await Order.deleteMany(); // empty order
        await User.deleteMany(); 
        await Product.deleteMany(); 

        //insert
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;
        
        const sampleProducts = products.map((product) => {
            //add every userInfo to product; 
            return {...product, user: adminUser}
        })

        //add product to data library
        await Product.insertMany(sampleProducts);

        console.log('samples are inserted successfully'.green.inverse);
        process.exit();
    } catch (error) { 
        console.log(`${error}`.red.inverse);
        process.exit(1);
    }
}

//insert data example to data library
const destroyData = async () => { 
    try {
        //empty example exist-data in data library
        await Order.deleteMany(); // empty order
        await User.deleteMany(); 
        await Product.deleteMany(); 

        console.log('samples are deleted successfully'.green.inverse);
        process.exit();
    } catch (error) { 
        console.log(`${error}`.red.inverse);
        process.exit(1);
    }
}

//distiguish to deploy which function
//use node to get params
if (process.argv[2] == '-d') {
    destroyData();
} else { 
    importData();
}