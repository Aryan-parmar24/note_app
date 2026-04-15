import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/ContextProvider';
import { API_URL } from '../config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Forgot Password States
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [forgotStep, setForgotStep] = useState(1); // 1=email, 2=otp, 3=new password
    const [forgotLoading, setForgotLoading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            });

            if (response.data.success) {
                const userData = {
                    name: response.data.user.name,
                    email: email,
                    token: response.data.token
                };
                login(userData, response.data.token);
                navigate("/");
            } else {
                alert(response.data.message || "Login failed.");
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    // Step 1: Send OTP to email
    // const handleSendOTP = async (e) => {
    //     e.preventDefault();
    //     setForgotLoading(true);
    //     setMessage('');
    //     try {
    //         const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
    //             email: forgotEmail
    //         });
    //         if (response.data.success) {
    //             setMessage('✅ OTP sent to your email!');
    //             setForgotStep(2);
    //         } else {
    //             setMessage('❌ ' + response.data.message);
    //         }
    //     } catch (error) {
    //         setMessage('❌ ' + (error.response?.data?.message || 'Failed to send OTP'));
    //     } finally {
    //         setForgotLoading(false);
    //     }
    // };
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setForgotLoading(true);
        setMessage('');
        try {
            const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
                email: forgotEmail
            });
            if (response.data.success) {
                setMessage('✅ OTP sent to your email!');
                setForgotStep(2);
            } else {
                setMessage('❌ ' + response.data.message);
            }
        } catch (error) {
            setMessage('❌ ' + (error.response?.data?.message || 'Failed to send OTP'));
        } finally {
            setForgotLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setForgotLoading(true);
        setMessage('');
        try {
            const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
                email: forgotEmail,
                otp: otp
            });
            if (response.data.success) {
                setMessage('✅ OTP verified! Set new password.');
                setForgotStep(3);
            } else {
                setMessage('❌ ' + response.data.message);
            }
        } catch (error) {
            setMessage('❌ ' + (error.response?.data?.message || 'Invalid OTP'));
        } finally {
            setForgotLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('❌ Passwords do not match!');
            return;
        }
        if (newPassword.length < 6) {
            setMessage('❌ Password must be at least 6 characters!');
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
                setMessage('✅ Password reset successful! Please login.');
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
                setMessage('❌ ' + response.data.message);
            }
        } catch (error) {
            setMessage('❌ ' + (error.response?.data?.message || 'Failed to reset password'));
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
        <div className='flex justify-center items-center min-h-screen bg-gray-100 px-4'>
            <div className='border shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-sm bg-white'>
                <h2 className='text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800'>
                    🔐 Login
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-medium mb-1.5'>Email</label>
                        <input
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter email'
                            required
                        />
                    </div>

                    <div className='mb-2'>
                        <label className='block text-gray-700 text-sm font-medium mb-1.5'>Password</label>
                        <input
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Enter password'
                            required
                        />
                    </div>

                    {/* Forgot Password Link */}
                    <div className='mb-4 text-right'>
                        <button
                            type='button'
                            onClick={() => setShowForgotPassword(true)}
                            className='text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors'
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors active:scale-95 disabled:opacity-50'
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <p className='text-center mt-4 text-gray-600'>
                        Don't Have Account?{' '}
                        <Link to="/register" className='text-teal-600 hover:text-teal-800 font-medium'>
                            Signup
                        </Link>
                    </p>
                </form>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end sm:items-center z-50 p-0 sm:p-4'>
                    <div className='bg-white w-full sm:w-[450px] sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl'>
                        {/* Header */}
                        <div className='flex justify-between items-center p-4 sm:p-6 border-b border-gray-200'>
                            <h2 className='text-xl font-bold text-gray-800'>
                                {forgotStep === 1 && '🔑 Forgot Password'}
                                {forgotStep === 2 && '📧 Enter OTP'}
                                {forgotStep === 3 && '🔒 New Password'}
                            </h2>
                            <button
                                onClick={closeForgotPassword}
                                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors text-lg'
                            >
                                ✕
                            </button>
                        </div>

                        <div className='p-4 sm:p-6'>
                            {/* Step Progress */}
                            <div className='flex items-center justify-center gap-2 mb-6'>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${forgotStep >= 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                                <div className={`w-8 h-1 ${forgotStep >= 2 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${forgotStep >= 2 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                                <div className={`w-8 h-1 ${forgotStep >= 3 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${forgotStep >= 3 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                            </div>

                            {/* Message */}
                            {message && (
                                <div className={`p-3 rounded-lg mb-4 text-sm text-center ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {message}
                                </div>
                            )}

                            {/* Step 1: Enter Email */}
                            {forgotStep === 1 && (
                                <form onSubmit={handleSendOTP}>
                                    <p className='text-gray-600 text-sm mb-4'>Enter your email address and we'll send you an OTP to reset your password.</p>
                                    <input
                                        type='email'
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        placeholder='Enter your email'
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4'
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type='submit'
                                        disabled={forgotLoading}
                                        className='w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50'
                                    >
                                        {forgotLoading ? 'Sending OTP...' : 'Send OTP'}
                                    </button>
                                </form>
                            )}

                            {/* Step 2: Enter OTP */}
                            {forgotStep === 2 && (
                                <form onSubmit={handleVerifyOTP}>
                                    <p className='text-gray-600 text-sm mb-4'>Enter the 6-digit OTP sent to <strong>{forgotEmail}</strong></p>
                                    <input
                                        type='text'
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder='Enter 6-digit OTP'
                                        maxLength={6}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-center tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4'
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type='submit'
                                        disabled={forgotLoading}
                                        className='w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50'
                                    >
                                        {forgotLoading ? 'Verifying...' : 'Verify OTP'}
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => { setForgotStep(1); setMessage(''); }}
                                        className='w-full mt-2 text-gray-500 hover:text-gray-700 py-2 text-sm'
                                    >
                                        ← Back to email
                                    </button>
                                </form>
                            )}

                            {/* Step 3: New Password */}
                            {forgotStep === 3 && (
                                <form onSubmit={handleResetPassword}>
                                    <p className='text-gray-600 text-sm mb-4'>Enter your new password.</p>
                                    <input
                                        type='password'
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder='New password (min 6 chars)'
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3'
                                        required
                                        autoFocus
                                    />
                                    <input
                                        type='password'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder='Confirm new password'
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4'
                                        required
                                    />
                                    <button
                                        type='submit'
                                        disabled={forgotLoading}
                                        className='w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50'
                                    >
                                        {forgotLoading ? 'Resetting...' : 'Reset Password'}
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