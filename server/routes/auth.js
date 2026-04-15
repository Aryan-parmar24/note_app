import 'dotenv/config';
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import middleware from '../middleware/middleware.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// REGISTER
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

// LOGIN
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

// VERIFY
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

// FORGOT PASSWORD - Send OTP
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: false,
                message: "No account found with this email"
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to user
        user.resetOTP = otp;
        user.resetOTPExpiry = otpExpiry;
        await user.save();

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '🔑 Note App - Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #0d9488; text-align: center;">Note App</h2>
                    <h3 style="text-align: center;">Password Reset Request</h3>
                    <p>Hello <strong>${user.name}</strong>,</p>
                    <p>Your OTP for password reset is:</p>
                    <div style="background: #f0fdfa; border: 2px solid #0d9488; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #0d9488; letter-spacing: 8px; margin: 0;">${otp}</h1>
                    </div>
                    <p style="color: #666;">This OTP is valid for <strong>10 minutes</strong>.</p>
                    <p style="color: #666;">If you didn't request this, please ignore this email.</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">Note App © 2025</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email"
        });
    } catch (error) {
        console.log("Forgot password error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP. Please try again."
        });
    }
});

// VERIFY OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.resetOTP || !user.resetOTPExpiry) {
            return res.status(200).json({
                success: false,
                message: "No OTP request found. Please request a new OTP."
            });
        }

        if (new Date() > user.resetOTPExpiry) {
            user.resetOTP = null;
            user.resetOTPExpiry = null;
            await user.save();
            return res.status(200).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        if (user.resetOTP !== otp) {
            return res.status(200).json({
                success: false,
                message: "Invalid OTP. Please try again."
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });
    } catch (error) {
        console.log("Verify OTP error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.resetOTP || user.resetOTP !== otp) {
            return res.status(200).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (new Date() > user.resetOTPExpiry) {
            return res.status(200).json({
                success: false,
                message: "OTP has expired"
            });
        }

        // Hash new password
        const hashPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear OTP
        user.password = hashPassword;
        user.resetOTP = null;
        user.resetOTPExpiry = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        console.log("Reset password error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

export default router;