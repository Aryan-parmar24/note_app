import { API_URL } from '../config';
import React from 'react';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import NoteModel from '../components/NoteModel';
import NoteView from '../components/NoteView';
import ShareModal from '../components/ShareModal';
import axios from 'axios';
import NoteCard from '../components/NoteCard';
import { useAuth } from '../context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Home = () => {
    const [isModelOpen, setModelOpen] = useState(false);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [note, setNote] = useState([]);
    const [sharedNotes, setSharedNotes] = useState([]);
    const [currentNote, setCurrenNote] = useState(null);
    const [query, setQuery] = useState('');
    const [viewNote, setViewNote] = useState(null);
    const [viewIsOwner, setViewIsOwner] = useState(true);
    const [shareNote, setShareNote] = useState(null);
    const [activeTab, setActiveTab] = useState('my');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchNotes();
        }
    }, [user]);

    useEffect(() => {
        const currentNotes = activeTab === 'my' ? note : sharedNotes;
        if (query.trim() === '') {
            setFilteredNotes(currentNotes);
        } else {
            const filtered = currentNotes.filter((n) =>
                n.title?.toLowerCase().includes(query.toLowerCase()) ||
                n.description?.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredNotes(filtered);
        }
    }, [query, note, sharedNotes, activeTab]);

    const fetchNotes = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/note`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (data.note && Array.isArray(data.note)) {
                setNote(data.note);
            } else {
                setNote([]);
            }
            if (data.sharedNotes && Array.isArray(data.sharedNotes)) {
                setSharedNotes(data.sharedNotes);
            } else {
                setSharedNotes([]);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const closeModel = () => {
        setModelOpen(false);
        setCurrenNote(null);
    };

    const onEdit = (note) => {
        setCurrenNote(note);
        setModelOpen(true);
    };

    const onView = (note, isOwner = true) => {
        setViewNote(note);
        setViewIsOwner(isOwner);
    };

    const closeView = () => {
        setViewNote(null);
    };

    const onShare = (note) => {
        setShareNote(note);
    };

    const closeShare = () => {
        setShareNote(null);
        fetchNotes();
    };

    const addNote = async (title, description) => {
        if (!title.trim()) {
            toast.error('Please enter a title!');
            return;
        }
        if (!description.trim()) {
            toast.error('Please enter a description!');
            return;
        }
        try {
            const response = await axios.post(`${API_URL}/api/note/add`,
                { title, description }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.data.success) {
                toast.success('Note added! 📝');
                await fetchNotes();
                closeModel();
            }
        } catch (error) {
            toast.error("Failed to add note!");
        }
    };

    const deleteNote = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/api/note/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.data.success) {
                toast.success('Note deleted! 🗑️');
                fetchNotes();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete note!");
        }
    };

    const editNote = async (id, title, description) => {
        if (!title.trim()) {
            toast.error('Please enter a title!');
            return;
        }
        if (!description.trim()) {
            toast.error('Please enter a description!');
            return;
        }
        try {
            const response = await axios.put(`${API_URL}/api/note/${id}`,
                { title, description }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.data.success) {
                toast.success('Note updated! ✅');
                fetchNotes();
                closeModel();
            }
        } catch (error) {
            toast.error("Failed to update note!");
        }
    };

    return (
        <div className='bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors'>
            <Navbar setQuery={setQuery} />

            {/* Tabs */}
            <div className='px-3 sm:px-6 md:px-8 pt-4'>
                <div className='flex gap-2 mb-4'>
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === 'my'
                                ? 'bg-teal-500 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        📝 My Notes ({note.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('shared')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === 'shared'
                                ? 'bg-teal-500 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        🤝 Shared ({sharedNotes.length})
                    </button>
                </div>
            </div>

            {/* Notes Grid */}
            <div className='px-3 sm:px-6 md:px-8 pb-20'>
                {filteredNotes.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5'>
                        {filteredNotes.map((notes, index) => (
                            <NoteCard
                                key={notes._id || notes.id}
                                notes={notes}
                                onEdit={onEdit}
                                deleteNote={deleteNote}
                                onView={(n) => onView(n, activeTab === 'my')}
                                onShare={onShare}
                                isOwner={activeTab === 'my'}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center mt-20'>
                        <p className='text-6xl mb-4'>
                            {activeTab === 'my' ? '📝' : '🤝'}
                        </p>
                        <p className='text-gray-500 dark:text-gray-400 text-lg font-medium'>
                            {activeTab === 'my' ? 'No Notes Yet' : 'No Shared Notes'}
                        </p>
                        <p className='text-gray-400 dark:text-gray-500 text-sm mt-1'>
                            {activeTab === 'my'
                                ? 'Tap + to create your first note'
                                : 'Join a shared note using invite link'}
                        </p>
                    </div>
                )}
            </div>

            {/* Floating Add Button */}
            <motion.button
                onClick={() => setModelOpen(true)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className='fixed right-4 bottom-6 sm:right-6 sm:bottom-8 w-14 h-14 text-2xl bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-40'
            >
                +
            </motion.button>

            {/* View Note Modal */}
            <AnimatePresence>
                {viewNote && (
                    <NoteView
                        note={viewNote}
                        closeView={closeView}
                        onEdit={onEdit}
                        deleteNote={deleteNote}
                        onShare={onShare}
                        isOwner={viewIsOwner}
                        onLeave={fetchNotes}
                    />
                )}
            </AnimatePresence>

            {/* Share Modal */}
            <AnimatePresence>
                {shareNote && (
                    <ShareModal
                        note={shareNote}
                        closeShare={closeShare}
                        onUpdate={fetchNotes}
                    />
                )}
            </AnimatePresence>

            {/* Add/Edit Note Modal */}
            <AnimatePresence>
                {isModelOpen && (
                    <NoteModel
                        closeModel={closeModel}
                        addNote={addNote}
                        currentNote={currentNote}
                        editNote={editNote}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;