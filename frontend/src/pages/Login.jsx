import React, { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/ContextProvider';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5050/api/auth/login', {
                email,
                password
            });
            
            // If successful (status 200)
            if (response.data.success) {
                const userData = {
                    name: response.data.user.name,
                    email: email,
                    token: response.data.token
                };
                login(userData, response.data.token);
                navigate("/");
            }
        } catch (error) {
            if (error.response) {
                console.log("Error response:", error.response.data);
                alert(error.response.data?.message || "Invalid email or password");
            } else if (error.request) {
                alert("Cannot connect to server. Please check if backend is running.");
            } else {
                alert("An error occurred. Please try again.");
            }
        }
    }
    
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='border shadow p-6 w-80 bg-white'>
                <h2 className='text-2xl font-bold mb-4'>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Email</label>
                        <input
                            className='w-full px-3 py-2 border'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter email' required />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700'>Password</label>
                        <input
                            className='w-full px-3 py-2 border'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Enter password' required />
                    </div>
                    <button type='submit' className='w-full bg-teal-600 text-white py-2 mb-4'>Login</button>

                    <p className='text-center'>
                        Don't Have Account? <Link to="/register">Signup</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login;