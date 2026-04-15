import { API_URL } from '../config';
import React from 'react';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import NoteModel from '../components/NoteModel';
import axios from 'axios';
import NoteCard from '../components/NoteCard';
import { useAuth } from '../context/ContextProvider';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [isModelOpen, setModelOpen] = useState(false);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [note, setNote] = useState([]);
    const [currentNote, setCurrenNote] = useState(null);
    const [query, setQuery] = useState('');
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
        if (query.trim() === '') {
            setFilteredNotes(note);
        } else {
            const filtered = note.filter((notes) =>
                notes.title?.toLowerCase().includes(query.toLowerCase()) ||
                notes.description?.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredNotes(filtered);
        }
    }, [query, note]);

    const fetchNotes = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/note`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (data.note && Array.isArray(data.note)) {
                setNote(data.note);
            } else if (Array.isArray(data)) {
                setNote(data);
            } else {
                setNote([]);
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

    const addNote = async (title, description) => {
        try {
            const response = await axios.post(`${API_URL}/api/note/add`,
                { title, description }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.data.success) {
                await fetchNotes();
                closeModel();
            }
        } catch (error) {
            console.log(error);
            alert("Failed to add note");
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
                fetchNotes();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const editNote = async (id, title, description) => {
        try {
            const response = await axios.put(`${API_URL}/api/note/${id}`,
                { title, description }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.data.success) {
                fetchNotes();
                closeModel();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='bg-gray-100 min-h-screen'>
            <Navbar setQuery={setQuery} />

            {/* Notes Grid - Responsive */}
            <div className='px-3 sm:px-6 md:px-8 pt-4 pb-20'>
                {filteredNotes.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5'>
                        {filteredNotes.map(notes => (
                            <NoteCard
                                key={notes._id || notes.id}
                                notes={notes}
                                onEdit={onEdit}
                                deleteNote={deleteNote}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center mt-20'>
                        <p className='text-6xl mb-4'>📝</p>
                        <p className='text-gray-500 text-lg font-medium'>No Notes Yet</p>
                        <p className='text-gray-400 text-sm mt-1'>Tap + to create your first note</p>
                    </div>
                )}
            </div>

            {/* Floating Add Button */}
            <button
                onClick={() => setModelOpen(true)}
                className='fixed right-4 bottom-6 sm:right-6 sm:bottom-8 w-14 h-14 text-2xl bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center z-40'
            >
                +
            </button>

            {isModelOpen && (
                <NoteModel
                    closeModel={closeModel}
                    addNote={addNote}
                    currentNote={currentNote}
                    editNote={editNote}
                />
            )}
        </div>
    );
};

export default Home;