import { API_URL } from '../config';
import React from 'react'
import Navbar from '../components/Navbar'
import { useState } from 'react'
import NoteModel from '../components/NoteModel';
import axios from 'axios';
import { useEffect } from 'react';
import NoteCard from '../components/NoteCard';

const Home = () => {
    const [isModelOpen, setModelOpen] = useState(false);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [note, setNote] = useState([]);
    const [currentNote, setCurrenNote] = useState(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetchNotes();
    }, [])

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
    }, [query, note])

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
    }

    const closeModel = () => {
        setModelOpen(false);
        setCurrenNote(null);
    }

    const onEdit = (note) => {
        setCurrenNote(note)
        setModelOpen(true);
    }

    const addNote = async (title, description) => {
        try {
            const response = await
                axios.post(`${API_URL}/api/note/add`,
                    { title, description }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
            if (response.data.success) {
                await fetchNotes();  // Refresh the notes list
                closeModel();  // Close modal
            }
        } catch (error) {
            console.log(error);
            alert("Failed to add note");

        }
    }

    const deleteNote = async (id) => {
        try {
            const response = await
                axios.delete(`${API_URL}/api/note/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
            if (response.data.success) {
                fetchNotes();  // Refresh the notes list
            }
        } catch (error) {
            console.log(error);
        }
    }

    const editNote = async (id, title, description) => {
        try {
            const response = await
                axios.put(`${API_URL}/api/note/${id}`,
                    { title, description }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
            if (response.data.success) {
                fetchNotes();  // Refresh the notes list
                closeModel();  // Close modal
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='bg-gray-100 min-h-screen'>
            <Navbar setQuery={setQuery} />

            <div className='px-8 pt-4 grid grid-cols-1 md:grid-cols-3 gap-5 '>
                {filteredNotes.length > 0 ? filteredNotes.map(notes => {
                    return <NoteCard
                        key={notes._id || notes.id}
                        notes={notes}
                        onEdit={onEdit}
                        deleteNote={deleteNote}
                    />
                }) : <p>No Notes</p>}
            </div>

            <button
                onClick={() => setModelOpen(true)}
                className='fixed right-4 bottom-4 text-2xl bg-teal-500 text-white font-bold p-4 rounded-full'>
                +
            </button>

            {isModelOpen && <NoteModel
                closeModel={closeModel}
                addNote={addNote}
                currentNote={currentNote}
                editNote={editNote}
            />}
        </div>
    )
}

export default Home
