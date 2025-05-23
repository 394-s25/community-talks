// src/App.jsx

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import IssuePage from './pages/issue';
import ProfilePage from './pages/profile';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root → redirect to home */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Public routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Other public route */}
          <Route path="/department/:deptId" element={<IssuePage />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
