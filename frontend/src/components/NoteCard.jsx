import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const NoteCard = ({ notes, onEdit, deleteNote }) => {
    return (
        <div className='bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col justify-between min-h-[120px]'>
            {/* Note Content */}
            <div className='flex-1'>
                <h2 className='text-lg sm:text-xl font-bold text-gray-800 mb-2 break-words'>
                    {notes.title}
                </h2>
                <p className='text-gray-600 text-sm sm:text-base break-words leading-relaxed'>
                    {notes.description?.length > 150
                        ? notes.description.substring(0, 150) + '...'
                        : notes.description}
                </p>
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end mt-3 pt-3 border-t border-gray-100 gap-3'>
                <button
                    className='flex items-center gap-1.5 text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors active:scale-95 px-2 py-1'
                    onClick={() => onEdit(notes)}
                >
                    <FaEdit /> <span className='sm:inline'>Edit</span>
                </button>

                <button
                    className='flex items-center gap-1.5 text-red-500 hover:text-red-700 text-sm font-medium transition-colors active:scale-95 px-2 py-1'
                    onClick={() => deleteNote(notes._id)}
                >
                    <FaTrash /> <span className='sm:inline'>Delete</span>
                </button>
            </div>
        </div>
    );
};

export default NoteCard;