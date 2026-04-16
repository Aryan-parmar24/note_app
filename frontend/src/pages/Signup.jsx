import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import toast from 'react-hot-toast';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
        toast.error('Please enter your name!');
        return;
    }
    if (name.trim().length < 2) {
        toast.error('Name must be at least 2 characters!');
        return;
    }
    if (!email.trim()) {
        toast.error('Please enter your email!');
        return;
    }
    if (!password.trim()) {
        toast.error('Please enter a password!');
        return;
    }
    if (password.length < 6) {
        toast.error('Password must be at least 6 characters!');
        return;
    }

    setLoading(true);

    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            name, email, password
        });

        if (response.data.success) {
            toast.success('Account created successfully! 🎉');
            setTimeout(() => navigate("/login"), 1500);
        } else {
            toast.error(response.data.message || "Registration failed!");
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 transition-colors'>
            <div className='border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-sm bg-white dark:bg-gray-800 transition-colors'>
                <h2 className='text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white'>
                    ✍️ Signup
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5'>Name</label>
                        <input
                            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all'
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Enter name'
                            required
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5'>Email</label>
                        <input
                            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter email'
                            required
                        />
                    </div>

                    <div className='mb-6'>
                        <label className='block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5'>Password</label>
                        <div className='relative'>
                            <input
                                className='w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all'
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter password'
                                required
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

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2'
                    >
                        {loading ? (
                            <>
                                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                <span>Creating Account...</span>
                            </>
                        ) : 'Signup'}
                    </button>

                    <p className='text-center mt-4 text-gray-600 dark:text-gray-400'>
                        Already have an account?{' '}
                        <Link to="/login" className='text-teal-600 hover:text-teal-800 dark:text-teal-400 font-medium'>
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;