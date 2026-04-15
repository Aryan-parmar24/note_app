import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    resetOTP: {
        type: String,
        default: null
    },

    resetOTPExpiry: {
        type: Date,
        default: null
    }
});

const User = mongoose.model('User', UserSchema);
export default User;