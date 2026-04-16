import React, { useState } from 'react';
import {
    FaTimes, FaCopy, FaCheck, FaUsers,
    FaTrash, FaLink, FaQrcode, FaShareAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { Share } from '@capacitor/share';
import { API_URL } from '../config';
import toast from 'react-hot-toast';

const ShareModal = ({ note, closeShare, onUpdate }) => {
    const [shareCode, setShareCode] = useState(note.shareCode || null);
    const [isShared, setIsShared] = useState(note.isShared || false);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const shareLink = shareCode
        ? `${window.location.origin}/join/${shareCode}`
        : '';

    const handleEnableSharing = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/note/share/${note._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            if (response.data.success) {
                setShareCode(response.data.shareCode);
                setIsShared(true);
                toast.success('Share link created! 🔗');
                if (onUpdate) onUpdate();
            }
        } catch (error) {
            toast.error('Failed to create share link!');
        } finally {
            setLoading(false);
        }
    };

    const handleDisableSharing = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/note/unshare/${note._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            if (response.data.success) {
                setShareCode(null);
                setIsShared(false);
                setShowQR(false);
                toast.success('Sharing disabled!');
                if (onUpdate) onUpdate();
                closeShare();
            }
        } catch (error) {
            toast.error('Failed to disable sharing!');
        } finally {
            setLoading(false);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Join my note: ${note.title}`,
                    text: `Hey! I'm sharing a note with you on NoteApp. Click the link to join and collaborate! 🤝`,
                    url: shareLink
                });
                toast.success('Shared! 🎉');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    handleCopyLink();
                }
            }
        } else {
            handleCopyLink();
            toast.success('Link copied! Paste it in WhatsApp or Telegram 📱', {
                duration: 4000
            });
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink).then(() => {
            setCopied(true);
            toast.success('Link copied! 📋');
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            // Fallback for mobile if clipboard fails
            const textArea = document.createElement('textarea');
            textArea.value = shareLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            toast.success('Link copied! 📋');
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleRemoveCollaborator = async (collaboratorId) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/note/remove-collaborator/${note._id}`,
                { collaboratorId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            if (response.data.success) {
                toast.success('Collaborator removed!');
                if (onUpdate) onUpdate();
            }
        } catch (error) {
            toast.error('Failed to remove collaborator!');
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end sm:items-center z-50 p-0 sm:p-4'
                onClick={closeShare}
            >
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className='bg-white dark:bg-gray-800 w-full sm:w-[500px] sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto'
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className='flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700'>
                        <h2 className='text-xl font-bold text-gray-800 dark:text-white'>
                            🔗 Share Note
                        </h2>
                        <button
                            onClick={closeShare}
                            className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-500'
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className='p-4 sm:p-6'>
                        {/* Note Title */}
                        <div className='bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4'>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                Sharing note:
                            </p>
                            <p className='font-bold text-gray-800 dark:text-white'>
                                {note.title}
                            </p>
                        </div>

                        {/* Enable Sharing Button */}
                        {!isShared ? (
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handleEnableSharing}
                                disabled={loading}
                                className='w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50'
                            >
                                {loading ? (
                                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                ) : (
                                    <><FaLink /> Enable Sharing</>
                                )}
                            </motion.button>
                        ) : (
                            <>
                                {/* Share Buttons */}
                                <div className='grid grid-cols-2 gap-3 mb-4'>

                                    {/* Native Share - WhatsApp etc */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleNativeShare}
                                        className='flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium text-sm'
                                    >
                                        <FaShareAlt />
                                        Share
                                    </motion.button>

                                    {/* Copy Link */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCopyLink}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-colors ${copied
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        {copied
                                            ? <><FaCheck /> Copied!</>
                                            : <><FaCopy /> Copy Link</>
                                        }
                                    </motion.button>

                                    {/* QR Code */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowQR(!showQR)}
                                        className='col-span-2 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-medium text-sm'
                                    >
                                        <FaQrcode />
                                        {showQR ? 'Hide QR Code' : 'Show QR Code'}
                                    </motion.button>
                                </div>

                                {/* QR Code Display */}
                                <AnimatePresence>
                                    {showQR && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className='flex flex-col items-center bg-white p-4 rounded-xl mb-4 border border-gray-200'
                                        >
                                            <QRCodeSVG
                                                value={shareLink}
                                                size={180}
                                                bgColor="#ffffff"
                                                fgColor="#0d9488"
                                                level="H"
                                            />
                                            <p className='text-xs text-gray-500 mt-3 text-center'>
                                                📷 Scan this QR code to join the note!
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Link Preview */}
                                <div className='bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4'>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                                        Share link:
                                    </p>
                                    <p className='text-xs text-teal-600 dark:text-teal-400 break-all'>
                                        {shareLink}
                                    </p>
                                </div>

                                {/* Collaborators List */}
                                <div className='mb-4'>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <FaUsers className='text-teal-500' />
                                        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                            Collaborators ({note.collaborators?.length || 0})
                                        </span>
                                    </div>

                                    {note.collaborators && note.collaborators.length > 0 ? (
                                        <div className='space-y-2'>
                                            {note.collaborators.map((collab, index) => (
                                                <div
                                                    key={index}
                                                    className='flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg'
                                                >
                                                    <div>
                                                        <p className='font-medium text-gray-800 dark:text-white text-sm'>
                                                            {collab.name}
                                                        </p>
                                                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                            {collab.email}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveCollaborator(collab.userId)}
                                                        className='text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50'
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='text-sm text-gray-400 dark:text-gray-500 text-center py-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                                            No one joined yet. Share the link! 👆
                                        </p>
                                    )}
                                </div>

                                {/* Disable Sharing */}
                                <button
                                    onClick={handleDisableSharing}
                                    disabled={loading}
                                    className='w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-medium text-sm disabled:opacity-50'
                                >
                                    🚫 Disable Sharing
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ShareModal;