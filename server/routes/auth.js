import 'dotenv/config';
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import middleware from '../middleware/middleware.js';

const router = express.Router();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({
                code: 2,
                success: false,
                message: "User already exist"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name, email, password: hashPassword
        });

        await newUser.save();

        return res.status(200).json({
            code: 1,
            success: true,
            message: "Account Created Successfully!!!"
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            code: 0,
            success: false,
            message: "Server Error!!!"
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                code: 0,
                success: false,
                message: "User not exist"
            });
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(401).json({
                code: 0,
                success: false,
                message: "Oop's Wrong credential"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: "5h" }
        );

        return res.status(200).json({
            code: 1,
            success: true,
            token,
            user: { name: user.name },
            message: "Login Successfully!!!"
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            code: 0,
            success: false,
            message: "Server Error!!!"
        });
    }
});

router.get('/verify', middleware, async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        console.log("=== FORGOT PASSWORD ===");

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: false,
                message: "No account found with this email"
            });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.resetOTP = otp;
        user.resetOTPExpiry = otpExpiry;
        await user.save();

        console.log("OTP generated for:", email);

        return res.status(200).json({
            success: true,
            message: "OTP generated successfully",
            otp: otp
        });
    } catch (error) {
        console.log("Forgot password error:", error.message);
        return res.status(200).json({
            success: false,
            message: "Failed to generate OTP"
        });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ success: false, message: "User not found" });
        }

        if (!user.resetOTP || !user.resetOTPExpiry) {
            return res.status(200).json({ success: false, message: "No OTP request found" });
        }

        if (new Date() > user.resetOTPExpiry) {
            user.resetOTP = null;
            user.resetOTPExpiry = null;
            await user.save();
            return res.status(200).json({ success: false, message: "OTP expired" });
        }

        if (user.resetOTP !== otp) {
            return res.status(200).json({ success: false, message: "Invalid OTP" });
        }

        return res.status(200).json({ success: true, message: "OTP verified" });
    } catch (error) {
        console.log("Verify OTP error:", error.message);
        return res.status(200).json({ success: false, message: "Server Error" });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ success: false, message: "User not found" });
        }

        if (!user.resetOTP || user.resetOTP !== otp) {
            return res.status(200).json({ success: false, message: "Invalid OTP" });
        }

        if (new Date() > user.resetOTPExpiry) {
            return res.status(200).json({ success: false, message: "OTP expired" });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        user.resetOTP = null;
        user.resetOTPExpiry = null;
        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log("Reset password error:", error.message);
        return res.status(200).json({ success: false, message: "Server Error" });
    }
});

export default router;