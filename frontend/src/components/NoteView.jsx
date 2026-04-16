import React from 'react';
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const NoteView = ({ note, closeView, onEdit, deleteNote }) => {
    if (!note) return null;

    const handleDelete = () => {
        deleteNote(note._id);
        closeView();
    };

    const handleEdit = () => {
        closeView();
        onEdit(note);
    };

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end sm:items-center z-50 p-0 sm:p-4'
                onClick={closeView}
            >
                {/* Modal */}
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.95 }}
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300
                    }}
                    className='bg-white dark:bg-gray-800 w-full sm:w-[550px] sm:max-w-xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col'
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className='flex justify-between items-start p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0'>
                        <motion.h2
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className='text-xl sm:text-2xl font-bold text-gray-800 dark:text-white pr-4 break-words flex-1'
                        >
                            {note.title}
                        </motion.h2>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={closeView}
                            className='w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors'
                        >
                            <FaTimes />
                        </motion.button>
                    </div>

                    {/* Scrollable Content */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className='flex-1 overflow-y-auto p-4 sm:p-6'
                    >
                        <p className='text-gray-600 dark:text-gray-300 text-base leading-relaxed whitespace-pre-wrap break-words'>
                            {note.description}
                        </p>
                    </motion.div>

                    {/* Footer Buttons */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className='flex gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0'
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleEdit}
                            className='flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors'
                        >
                            <FaEdit /> Edit
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleDelete}
                            className='flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors'
                        >
                            <FaTrash /> Delete
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default NoteView;