import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UpdateNotifier = () => {
    const [showUpdate, setShowUpdate] = useState(false);

    useEffect(() => {
        // Check for updates every 5 minutes
        const checkInterval = setInterval(() => {
            checkForUpdates();
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(checkInterval);
    }, []);

    const checkForUpdates = async () => {
        try {
            // Fetch the latest index.html to check if JS bundle changed
            const response = await fetch(window.location.origin + '/?_=' + Date.now(), {
                cache: 'no-store'
            });
            const html = await response.text();

            // Get current script src
            const currentScripts = document.querySelectorAll('script[src]');
            let currentSrc = '';
            currentScripts.forEach(s => {
                if (s.src.includes('assets/')) {
                    currentSrc = s.src;
                }
            });

            // Check if new version has different script
            if (currentSrc && !html.includes(currentSrc.split('/').pop())) {
                setShowUpdate(true);
            }
        } catch (error) {
            // Silently fail
        }
    };

    const handleUpdate = () => {
        window.location.reload();
    };

    return (
        <AnimatePresence>
            {showUpdate && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className='fixed top-0 left-0 right-0 z-[100] p-3'
                >
                    <div className='max-w-md mx-auto bg-teal-500 text-white rounded-xl shadow-lg p-4 flex items-center justify-between gap-3'>
                        <div>
                            <p className='font-bold text-sm'>🎉 Update Available!</p>
                            <p className='text-xs text-teal-100'>
                                New features and improvements
                            </p>
                        </div>
                        <div className='flex gap-2'>
                            <button
                                onClick={handleUpdate}
                                className='bg-white text-teal-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-teal-50'
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setShowUpdate(false)}
                                className='text-teal-200 hover:text-white px-2'
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UpdateNotifier;