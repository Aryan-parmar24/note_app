import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/ContextProvider';
import { useTheme } from '../context/ThemeContext';
import { FaBars, FaTimes, FaSearch, FaSun, FaMoon } from 'react-icons/fa';

const Navbar = ({ setQuery }) => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMenuOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        setQuery(e.target.value);
    };

    const handleSearchIconClick = () => {
        setSearchOpen(!searchOpen);
        if (!searchOpen) {
            setSearchValue('');
            setQuery('');
        }
    };

    return (
        <nav className='bg-gray-800 dark:bg-gray-900 text-white sticky top-0 z-50 shadow-lg'>
            {/* Top Bar */}
            <div className='flex justify-between items-center px-4 py-3'>

                {/* Logo */}
                <Link to="/" className='text-xl font-bold tracking-wide'>
                    📝 NoteApp
                </Link>

                {/* Desktop Search Bar */}
                <div className='hidden md:flex flex-1 max-w-md mx-6'>
                    <div className='relative w-full'>
                        <button
                            type='button'
                            onClick={() => {
                                document.getElementById('desktop-search').focus();
                            }}
                            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10 cursor-pointer'
                        >
                            <FaSearch />
                        </button>
                        <input
                            id='desktop-search'
                            type='text'
                            value={searchValue}
                            placeholder='Search notes.....'
                            className='w-full bg-gray-700 dark:bg-gray-800 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all'
                            onChange={handleSearchChange}
                        />
                        {searchValue && (
                            <button
                                type='button'
                                onClick={() => {
                                    setSearchValue('');
                                    setQuery('');
                                }}
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors'
                            >
                                <FaTimes size={12} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Desktop Right Side */}
                <div className='hidden md:flex items-center gap-3'>
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className='bg-gray-700 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 p-2 rounded-lg transition-colors'
                        title={isDark ? 'Switch to Light' : 'Switch to Dark'}
                    >
                        {isDark
                            ? <FaSun className='text-yellow-400 text-lg' />
                            : <FaMoon className='text-blue-300 text-lg' />
                        }
                    </button>

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
                    {/* Theme Toggle Mobile */}
                    <button
                        onClick={toggleTheme}
                        className='text-white p-1 rounded-lg hover:bg-gray-700 transition-colors'
                    >
                        {isDark
                            ? <FaSun className='text-yellow-400 text-lg' />
                            : <FaMoon className='text-blue-300 text-lg' />
                        }
                    </button>

                    {/* Search Icon */}
                    <button
                        type='button'
                        onClick={handleSearchIconClick}
                        className='text-white p-1 rounded-lg hover:bg-gray-700 transition-colors active:scale-95'
                    >
                        {searchOpen
                            ? <FaTimes className='text-lg' />
                            : <FaSearch className='text-lg' />
                        }
                    </button>

                    {/* Hamburger */}
                    <button
                        type='button'
                        onClick={() => setMenuOpen(!menuOpen)}
                        className='text-white p-1 rounded-lg hover:bg-gray-700 transition-colors active:scale-95'
                    >
                        {menuOpen
                            ? <FaTimes className='text-xl' />
                            : <FaBars className='text-xl' />
                        }
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
                            value={searchValue}
                            placeholder='Search notes.....'
                            className='w-full bg-gray-700 dark:bg-gray-800 pl-10 pr-10 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
                            onChange={handleSearchChange}
                            autoFocus
                        />
                        {searchValue && (
                            <button
                                type='button'
                                onClick={() => {
                                    setSearchValue('');
                                    setQuery('');
                                }}
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'
                            >
                                <FaTimes size={12} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {menuOpen && (
                <div className='md:hidden bg-gray-700 dark:bg-gray-800 px-4 py-3 space-y-3 border-t border-gray-600'>
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