import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        resuired: true,
        default: false
    }
}, {
    timestamps: true
})

//realize user password encryption
//funciton pre() to reliaze data before writing in database
userSchema.pre('save', async function(next) { 
    //to test password is modified?
    if (!this.isModified('password')) {
        next();
    } 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

//password match
userSchema.methods.matchPassword = async function (enteredPassword) {
    //compare password(new entern password  existed in library)
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema);

export default User;