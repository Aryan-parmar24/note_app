import React from 'react';
import { FaEdit, FaTrash, FaShare, FaUsers } from 'react-icons/fa';

const NoteCard = ({ notes, onEdit, deleteNote, onView, onShare, isOwner }) => {
    return (
        <div
            onClick={() => onView(notes)}
            className='bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 flex flex-col justify-between min-h-[120px] cursor-pointer active:scale-95'
        >
            {/* Shared Badge */}
            {(notes.isShared || notes.collaborators?.length > 0) && (
                <div className='flex items-center gap-1.5 px-4 pt-3'>
                    <span className='flex items-center gap-1 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs px-2 py-0.5 rounded-full'>
                        <FaUsers size={10} />
                        {isOwner
                            ? `Shared • ${notes.collaborators?.length || 0} joined`
                            : `By ${notes.ownerName || 'Someone'}`
                        }
                    </span>
                </div>
            )}

            {/* Note Content */}
            <div className='p-4 sm:p-5 flex-1'>
                <h2 className='text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 break-words'>
                    {notes.title}
                </h2>
                <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base break-words leading-relaxed'>
                    {notes.description?.length > 100
                        ? notes.description.substring(0, 100) + '...'
                        : notes.description}
                </p>
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700 gap-2'>
                <button
                    className='flex items-center gap-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 text-sm font-medium active:scale-95 px-2 py-1'
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(notes);
                    }}
                >
                    <FaEdit /> Edit
                </button>

                {isOwner && (
                    <>
                        <button
                            className='flex items-center gap-1 text-teal-500 hover:text-teal-700 dark:text-teal-400 text-sm font-medium active:scale-95 px-2 py-1'
                            onClick={(e) => {
                                e.stopPropagation();
                                onShare(notes);
                            }}
                        >
                            <FaShare /> Share
                        </button>

                        <button
                            className='flex items-center gap-1 text-red-500 hover:text-red-700 dark:text-red-400 text-sm font-medium active:scale-95 px-2 py-1'
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteNote(notes._id);
                            }}
                        >
                            <FaTrash />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NoteCard;