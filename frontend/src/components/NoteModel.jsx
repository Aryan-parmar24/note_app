import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const NoteModel = ({ closeModel, addNote, currentNote, editNote }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (currentNote) {
            setTitle(currentNote.title);
            setDescription(currentNote.description);
        }
    }, [currentNote]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentNote) {
            editNote(currentNote._id, title, description);
        } else {
            addNote(title, description);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end sm:items-center z-50 p-0 sm:p-4'>
            <div className='bg-white w-full sm:w-[500px] sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto'>
                {/* Header */}
                <div className='flex justify-between items-center p-4 sm:p-6 border-b border-gray-200'>
                    <h2 className='text-xl sm:text-2xl font-bold text-gray-800'>
                        {currentNote ? "✏️ Edit Note" : "📝 Add New Note"}
                    </h2>
                    <button
                        onClick={closeModel}
                        className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors'
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className='p-4 sm:p-6'>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-medium mb-1.5'>
                            Title
                        </label>
                        <input
                            type='text'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder='Enter note title...'
                            className='border border-gray-300 p-3 w-full rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all'
                            required
                            autoFocus
                        />
                    </div>

                    <div className='mb-6'>
                        <label className='block text-gray-700 text-sm font-medium mb-1.5'>
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Enter note description...'
                            rows={5}
                            className='border border-gray-300 p-3 w-full rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none'
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className='flex gap-3'>
                        <button
                            type='button'
                            onClick={closeModel}
                            className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors active:scale-95'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium transition-colors active:scale-95'
                        >
                            {currentNote ? "Update Note" : "Add Note"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoteModel;