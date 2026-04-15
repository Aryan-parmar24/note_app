
// API Configuration
let API_URL;

// Check if we're in development or production
if (import.meta.env.DEV) {
    // Local development
    API_URL = 'http://localhost:5050';
} else {
    // Production (Vercel or mobile app)
    API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.onrender.com';
}

// Detect if running as mobile app
const isMobileApp = () => {
    return window.Capacitor !== undefined;
};

export { API_URL, isMobileApp };
