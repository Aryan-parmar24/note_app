import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/ContextProvider';
import toast from 'react-hot-toast';

const JoinNote = () => {
    const { shareCode } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [noteInfo, setNoteInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        if (!user) {
            // ✅ Save join URL before redirecting to login
            localStorage.setItem('redirectAfterLogin', `/join/${shareCode}`);
            toast.error('Please login first to join this note!');
            navigate('/login');
            return;
        }
        fetchNotePreview();
    }, [user, shareCode]);

    const fetchNotePreview = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/note/preview/${shareCode}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            if (response.data.success) {
                setNoteInfo(response.data.note);
            } else {
                toast.error('Invalid share link!');
                navigate('/');
            }
        } catch (error) {
            toast.error('Invalid or expired share link!');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        setJoining(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/note/join/${shareCode}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            if (response.data.success) {
                toast.success(response.data.message + ' 🎉');
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to join note!');
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900'>
                <div className='w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin'></div>
            </div>
        );
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm border border-gray-200 dark:border-gray-700'>
                <div className='text-center'>
                    <p className='text-5xl mb-4'>📝</p>
                    <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-2'>
                        Join Shared Note
                    </h2>

                    {noteInfo && (
                        <>
                            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 text-left'>
                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                    Note Title:
                                </p>
                                <p className='font-bold text-gray-800 dark:text-white text-lg'>
                                    {noteInfo.title}
                                </p>
                                <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
                                    Shared by: <strong>{noteInfo.ownerName}</strong>
                                </p>
                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                    {noteInfo.collaboratorsCount} people already joined
                                </p>
                            </div>

                            {noteInfo.isOwner ? (
                                <div className='bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 p-3 rounded-lg mb-4 text-sm'>
                                    You are the owner of this note!
                                </div>
                            ) : noteInfo.alreadyJoined ? (
                                <div className='bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-3 rounded-lg mb-4 text-sm'>
                                    ✅ You already have access to this note!
                                </div>
                            ) : null}

                            {!noteInfo.isOwner && !noteInfo.alreadyJoined ? (
                                <button
                                    onClick={handleJoin}
                                    disabled={joining}
                                    className='w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 mb-3'
                                >
                                    {joining ? (
                                        <>
                                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                            <span>Joining...</span>
                                        </>
                                    ) : '🤝 Join Note'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/')}
                                    className='w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium mb-3'
                                >
                                    Go to Home →
                                </button>
                            )}

                            <button
                                onClick={() => navigate('/')}
                                className='w-full text-gray-500 dark:text-gray-400 py-2 text-sm hover:text-gray-700'
                            >
                                Skip → Go to Home
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JoinNote;