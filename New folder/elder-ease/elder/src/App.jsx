import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import ElderDashboard from './pages/ElderDashboard';
import Medications from './pages/Medications';
import Routine from './pages/Routine';
import Wellness from './pages/Wellness';
import Alerts from './pages/Alerts';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CognitiveZone from './pages/CognitiveZone';
import MemoryWall from './pages/MemoryWall';
import Preferences from './pages/Preferences';
import VirtualNurse from './pages/VirtualNurse';
import Stories from './pages/Stories';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;

    return children;
};

function App() {
    return (
        <AuthProvider>
            <UIProvider>
                <Router>
                    <div className="app-container">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/" element={<LandingPage />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute role="Elder">
                                        <ElderDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/medications"
                                element={
                                    <ProtectedRoute role="Elder">
                                        <Medications />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/routine"
                                element={
                                    <ProtectedRoute role="Elder">
                                        <Routine />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/wellness"
                                element={
                                    <ProtectedRoute role="Elder">
                                        <Wellness />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/cognitive"
                                element={
                                    <ProtectedRoute role="Elder">
                                        <CognitiveZone />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/memory-wall"
                                element={
                                    <ProtectedRoute role="Elder">
                                        <MemoryWall />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/preferences"
                                element={
                                    <ProtectedRoute role="Elder">
                                        <Preferences />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/alerts"
                                element={
                                    <ProtectedRoute role="Elder">
                                        <Alerts />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/virtual-nurse"
                                element={
                                    <ProtectedRoute role="Elder">
                                        <VirtualNurse />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/stories"
                                element={
                                    <ProtectedRoute role="Elder">
                                        <Stories />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                </Router>
            </UIProvider>
        </AuthProvider>
    );
}

export default App;
