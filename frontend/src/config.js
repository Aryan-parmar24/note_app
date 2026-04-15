
// API Configuration
let API_URL;

// Check if we're in development or production
if (import.meta.env.DEV) {
    // Local development
    API_URL = `${API_URL}`;
} else {
    // Production (Vercel or mobile app)
    API_URL = import.meta.env.VITE_API_URL || 'https://note-app-backend-kp7x.onrender.com';
}

// Detect if running as mobile app
const isMobileApp = () => {
    return window.Capacitor !== undefined;
};

export { API_URL, isMobileApp };
