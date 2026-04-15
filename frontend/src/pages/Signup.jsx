import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, {
                name, email, password
            });

            if (response.data.success) {
                alert("Registration successful! Please login.");
                navigate("/login");
            } else {
                alert(response.data.message || "Registration failed");
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100 px-4'>
            <div className='border shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-sm bg-white'>
                <h2 className='text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800'>
                    ✍️ Signup
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-medium mb-1.5'>Name</label>
                        <input
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all'
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Enter name'
                            required
                        />
                    </div>

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

                    <div className='mb-6'>
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

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors active:scale-95 disabled:opacity-50'
                    >
                        {loading ? 'Creating Account...' : 'Signup'}
                    </button>

                    <p className='text-center mt-4 text-gray-600'>
                        Already have an account?{' '}
                        <Link to="/login" className='text-teal-600 hover:text-teal-800 font-medium'>
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;