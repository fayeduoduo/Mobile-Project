import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHander from 'express-async-handler';

//get token to auth user
const protect = asyncHander(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { 
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            //exclude password
            req.user = await User.findById(decoded.id).select('-password')
            next();
        } catch(error) { 
            res.status(401);
            throw new Error('unauthorized, verification failed')
        }
    }
    if (!token) { 
        res.status(401);
        throw new Error('unauthorized, no token')
    }
})

const admin = asyncHander(async (req, res, next) => { 
    //from protect function already get req.user
    if (req.user && req.user.isAdmin) {
        next();
    } else { 
        res.status(401);
        throw new Error('not admin')
    }
})
export { protect, admin };