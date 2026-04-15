import 'dotenv/config';
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import middleware from '../middleware/middleware.js';

const router = express.Router();

//REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({
                code: 2,
                success: false,
                message: "User already exist"
            })
        }

        //if user not exist then
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name, email, password: hashPassword
        });

        await newUser.save();

        return res.status(200).json({
            code: 1,
            success: true,
            message: "Account Created Successfully!!!"
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            code: 0,
            success: false,
            message: "Server Error!!!"
        })
    }
});


//LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                code: 0,
                success: false,
                message: "User not exist"
            })
        }

        //we need to check password is matched or not
        const checkPassword = await bcrypt.compare(password,user.password);

        if(!checkPassword){
            return res.status(401).json({
                code: 0,
                success: false,
                message: "Oop's Wrong credential"
            })
        }

        const token = jwt.sign(
        {
            id: user._id,
            name: user._name
        },
        process.env.JWT_SECRET,
        {expiresIn: "5h"}
    );

        return res.status(200).json({
            code: 1,
            success: true,
            token,
            user: {name: user.name},
            message: "Login Successfully!!!"
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            code: 0,
            success: false,
            message: "Server Error!!!"
        })
    }
});

router.get('/verify',middleware,async (req,res) => {
    try{
        return res.status(200).json({
            success: true,
            user: req.user
        })
    }catch(error){
        
    }
})
export default router;