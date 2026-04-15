import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/ContextProvider';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';

const Navbar = ({ setQuery }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMenuOpen(false);
    };

    return (
        <nav className='bg-gray-800 text-white sticky top-0 z-50 shadow-lg'>
            {/* Top Bar */}
            <div className='flex justify-between items-center px-4 py-3'>
                {/* Logo */}
                <Link to="/" className='text-xl font-bold tracking-wide'>
                    📝 NoteApp
                </Link>

                {/* Desktop Search Bar - Hidden on mobile */}
                <div className='hidden md:block flex-1 max-w-md mx-6'>
                    <div className='relative'>
                        <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                        <input
                            type='text'
                            placeholder='Search notes.....'
                            className='w-full bg-gray-700 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all'
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Desktop Buttons - Hidden on mobile */}
                <div className='hidden md:flex items-center gap-3'>
                    {!user ? (
                        <>
                            <Link to="/login" className='bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors'>
                                Login
                            </Link>
                            <Link to="/register" className='bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors'>
                                Signup
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className='bg-gray-700 px-3 py-1.5 rounded-lg text-sm'>
                                👋 {user.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className='bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors'
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Icons */}
                <div className='flex md:hidden items-center gap-3'>
                    <button onClick={() => setSearchOpen(!searchOpen)}>
                        <FaSearch className='text-lg' />
                    </button>
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FaTimes className='text-xl' /> : <FaBars className='text-xl' />}
                    </button>
                </div>
            </div>

            {/* Mobile Search Bar */}
            {searchOpen && (
                <div className='md:hidden px-4 pb-3'>
                    <div className='relative'>
                        <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                        <input
                            type='text'
                            placeholder='Search notes.....'
                            className='w-full bg-gray-700 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>
            )}

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className='md:hidden bg-gray-700 px-4 py-3 space-y-3 border-t border-gray-600'>
                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className='block text-center bg-teal-500 hover:bg-teal-600 px-4 py-2.5 rounded-lg font-medium transition-colors'
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMenuOpen(false)}
                                className='block text-center bg-blue-500 hover:bg-blue-600 px-4 py-2.5 rounded-lg font-medium transition-colors'
                            >
                                Signup
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className='text-center bg-gray-600 py-2.5 rounded-lg'>
                                👋 Welcome, {user.name}
                            </div>
                            <button
                                onClick={handleLogout}
                                className='w-full bg-red-500 hover:bg-red-600 px-4 py-2.5 rounded-lg font-medium transition-colors'
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;