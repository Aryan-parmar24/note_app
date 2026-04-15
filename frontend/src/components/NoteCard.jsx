import React from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa';


const NoteCard = ({ notes,onEdit,deleteNote }) => {
    return (
        <div className='bg-white p-4 rounded shadow'>
            <h2 className='text-xl font-bold'>{notes.title}</h2>
            <p>{notes.description}</p>
            <div className='flex justify-end mt-2'>
                <button className='text-blue-500 mr-2' onClick={() => onEdit(notes)}>
                    <FaEdit />
                </button>

                <button className='text-red-500' onClick={() => deleteNote(notes._id)}>
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

export default NoteCard
