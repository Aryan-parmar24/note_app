import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JoinNote from "./pages/JoinNote";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/ContextProvider';
import { motion } from 'framer-motion';

// Loading Spinner Component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
    </div>
);

// Protected Route
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" />;
    return children;
};

// Public Route - BUT checks for redirect first
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <LoadingSpinner />;

    if (user) {
        // ✅ If there's a pending redirect, go there
        const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
        if (redirectAfterLogin) {
            localStorage.removeItem('redirectAfterLogin');
            return <Navigate to={redirectAfterLogin} />;
        }
        return <Navigate to="/" />;
    }

    return children;
};

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                    <Route path="/login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />
                    <Route path="/register" element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    } />
                    {/* JoinNote handles its own auth */}
                    <Route path="/join/:shareCode" element={
                        <JoinNote />
                    } />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;