//set up server
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import path from 'path';
import axios from 'axios';
import { notFind, errorHandle } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config();
connectDB();

const app = express();

//get json data when auth users
//put the first place -- or postman can't show data
app.use(express.json())

//use morgan ->dev - development env
if (process.env.NODE_ENV == 'development') { 
    app.use(morgan('dev'))
}

// //build rout path
// app.get('/', (req, res) => { 
//     res.send('server is on...')
// })

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

//get payment status
app.get('/status', (req, res) => { 
    axios.get('https://www.thenewstep.cn/pay/logs/log.txt').then(
        (response) => { 
            res.json({status: response.data})
    }) 
})

//get Paypal
app.get('/api/config/paypal', (req, res) => { 
    res.send(process.env.PAYPAL_CLIENT_ID)
})

//set upload doc. -> static file
const __dirname = path.resolve() 
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

//get frontend static file, then can operate external website
if (process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))
    //use get method('*') => match any route path can get response
    app.get('*', (req, res) => { 
        res.sendFile(path.resolve(__dirname, "app","frontend","build", "index.html"))
    })
} else { 
    app.get('/', (req, res) => { 
        res.send('server is on...')
    })
}

app.use(notFind);
app.use(errorHandle);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server is on the ${process.env.NODE_ENV} situation ready on port ${PORT}`.yellow.bold));