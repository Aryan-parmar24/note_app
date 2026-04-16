import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/ContextProvider';
import { API_URL } from '../config';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [forgotStep, setForgotStep] = useState(1);
    const [forgotLoading, setForgotLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Please enter your email!');
            return;
        }
        if (!password.trim()) {
            toast.error('Please enter your password!');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            });

            if (response.data.success) {
                toast.success(`Welcome back! 👋`);
                const userData = {
                    name: response.data.user.name,
                    email: email,
                    token: response.data.token
                };
                login(userData, response.data.token);

                // ✅ Navigate to home
                // PublicRoute will automatically check
                // redirectAfterLogin and redirect to join page
                navigate("/");
            } else {
                toast.error(response.data.message || "Login failed!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed!");
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!forgotEmail.trim()) {
            toast.error('Please enter your email!');
            return;
        }
        setForgotLoading(true);
        setMessage('');
        try {
            const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
                email: forgotEmail
            });
            if (response.data.success) {
                toast.success('OTP sent to your email! ✅');
                setMessage('✅ OTP sent to your email!');
                setForgotStep(2);
            } else {
                toast.error(response.data.message);
                setMessage('❌ ' + response.data.message);
            }
        } catch (error) {
            toast.error('Failed to send OTP!');
            setMessage('❌ Failed to send OTP');
        } finally {
            setForgotLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp.trim() || otp.length < 6) {
            toast.error('Please enter a valid 6-digit OTP!');
            return;
        }
        setForgotLoading(true);
        setMessage('');
        try {
            const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
                email: forgotEmail,
                otp: otp
            });
            if (response.data.success) {
                toast.success('OTP verified! ✅');
                setMessage('✅ OTP verified!');
                setForgotStep(3);
            } else {
                toast.error(response.data.message);
                setMessage('❌ ' + response.data.message);
            }
        } catch (error) {
            toast.error('Invalid OTP!');
            setMessage('❌ Invalid OTP');
        } finally {
            setForgotLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters!');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }
        setForgotLoading(true);
        setMessage('');
        try {
            const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
                email: forgotEmail,
                otp: otp,
                newPassword: newPassword
            });
            if (response.data.success) {
                toast.success('Password reset successful! 🎉');
                setMessage('✅ Password reset successful!');
                setTimeout(() => {
                    setShowForgotPassword(false);
                    setForgotStep(1);
                    setForgotEmail('');
                    setOtp('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setMessage('');
                }, 2000);
            } else {
                toast.error(response.data.message);
                setMessage('❌ ' + response.data.message);
            }
        } catch (error) {
            toast.error('Failed to reset password!');
            setMessage('❌ Failed to reset password');
        } finally {
            setForgotLoading(false);
        }
    };

    const closeForgotPassword = () => {
        setShowForgotPassword(false);
        setForgotStep(1);
        setForgotEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setMessage('');
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 transition-colors'>
            <div className='border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-sm bg-white dark:bg-gray-800 transition-colors'>
                <h2 className='text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white'>
                    🔐 Login
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className='mb-4'>
                        <label className='block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5'>
                            Email
                        </label>
                        <input
                            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter email'
                        />
                    </div>

                    {/* Password */}
                    <div className='mb-2'>
                        <label className='block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5'>
                            Password
                        </label>
                        <div className='relative'>
                            <input
                                className='w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all'
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter password'
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div className='mb-4 text-right'>
                        <button
                            type='button'
                            onClick={() => setShowForgotPassword(true)}
                            className='text-teal-600 hover:text-teal-800 dark:text-teal-400 text-sm font-medium transition-colors'
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2'
                    >
                        {loading ? (
                            <>
                                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                <span>Logging in...</span>
                            </>
                        ) : 'Login'}
                    </button>

                    <p className='text-center mt-4 text-gray-600 dark:text-gray-400'>
                        Don't Have Account?{' '}
                        <Link
                            to="/register"
                            className='text-teal-600 hover:text-teal-800 dark:text-teal-400 font-medium'
                        >
                            Signup
                        </Link>
                    </p>
                </form>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end sm:items-center z-50 p-0 sm:p-4'>
                    <div className='bg-white dark:bg-gray-800 w-full sm:w-[450px] sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl transition-colors'>

                        {/* Header */}
                        <div className='flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700'>
                            <h2 className='text-xl font-bold text-gray-800 dark:text-white'>
                                {forgotStep === 1 && '🔑 Forgot Password'}
                                {forgotStep === 2 && '📧 Enter OTP'}
                                {forgotStep === 3 && '🔒 New Password'}
                            </h2>
                            <button
                                onClick={closeForgotPassword}
                                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors text-lg'
                            >
                                ✕
                            </button>
                        </div>

                        <div className='p-4 sm:p-6'>
                            {/* Step Progress */}
                            <div className='flex items-center justify-center gap-2 mb-6'>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${forgotStep >= 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                                    1
                                </div>
                                <div className={`w-8 h-1 ${forgotStep >= 2 ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${forgotStep >= 2 ? 'bg-teal-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                                    2
                                </div>
                                <div className={`w-8 h-1 ${forgotStep >= 3 ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${forgotStep >= 3 ? 'bg-teal-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                                    3
                                </div>
                            </div>

                            {/* Message */}
                            {message && (
                                <div className={`p-3 rounded-lg mb-4 text-sm text-center ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {message}
                                </div>
                            )}

                            {/* Step 1: Email */}
                            {forgotStep === 1 && (
                                <form onSubmit={handleSendOTP}>
                                    <p className='text-gray-600 dark:text-gray-400 text-sm mb-4'>
                                        Enter your email and we'll send you an OTP.
                                    </p>
                                    <input
                                        type='email'
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        placeholder='Enter your email'
                                        className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4'
                                    />
                                    <button
                                        type='submit'
                                        disabled={forgotLoading}
                                        className='w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
                                    >
                                        {forgotLoading ? (
                                            <>
                                                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                <span>Sending...</span>
                                            </>
                                        ) : 'Send OTP'}
                                    </button>
                                </form>
                            )}

                            {/* Step 2: OTP */}
                            {forgotStep === 2 && (
                                <form onSubmit={handleVerifyOTP}>
                                    <p className='text-gray-600 dark:text-gray-400 text-sm mb-4'>
                                        Enter the 6-digit OTP sent to{' '}
                                        <strong>{forgotEmail}</strong>
                                    </p>
                                    <input
                                        type='text'
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder='Enter 6-digit OTP'
                                        maxLength={6}
                                        className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base text-center tracking-widest font-bold bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4'
                                    />
                                    <button
                                        type='submit'
                                        disabled={forgotLoading}
                                        className='w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
                                    >
                                        {forgotLoading ? (
                                            <>
                                                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                <span>Verifying...</span>
                                            </>
                                        ) : 'Verify OTP'}
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => {
                                            setForgotStep(1);
                                            setMessage('');
                                        }}
                                        className='w-full mt-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 py-2 text-sm'
                                    >
                                        ← Back to email
                                    </button>
                                </form>
                            )}

                            {/* Step 3: New Password */}
                            {forgotStep === 3 && (
                                <form onSubmit={handleResetPassword}>
                                    <p className='text-gray-600 dark:text-gray-400 text-sm mb-4'>
                                        Enter your new password.
                                    </p>

                                    {/* New Password */}
                                    <div className='relative mb-3'>
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder='New password (min 6 chars)'
                                            className='w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500'
                                        />
                                        <button
                                            type='button'
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                                        >
                                            {showNewPassword ? '🙈' : '👁️'}
                                        </button>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className='relative mb-4'>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder='Confirm new password'
                                            className='w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500'
                                        />
                                        <button
                                            type='button'
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                                        >
                                            {showConfirmPassword ? '🙈' : '👁️'}
                                        </button>
                                    </div>

                                    <button
                                        type='submit'
                                        disabled={forgotLoading}
                                        className='w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
                                    >
                                        {forgotLoading ? (
                                            <>
                                                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                <span>Resetting...</span>
                                            </>
                                        ) : 'Reset Password'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;