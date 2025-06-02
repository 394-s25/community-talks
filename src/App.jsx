// src/App.jsx

import React from 'react';
import './App.css';
import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import IssuePage from './pages/issue';
import ForumPagefun from "./pages/ForumPage";
import ForumPostPage from './pages/ForumPostPage';
import ProfilePage from './pages/profile';
import FunctionPage from './pages/FunctionPage'; 

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root → redirect to home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/" />}/>

          {/* Public routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/department/:category/:slug" element={<IssuePage />} />

          <Route path="/forum" element={<ForumPage />}/>


          <Route path="/function" element={<FunctionPage />} />

          {/* Protected route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Dynamic department route with category + slug */}
          {/* <Route path="/department/:category/:slug" element={<IssuePage />} /> */}
          <Route path="/forum/posts/:postId" element={<ForumPostPage />}/>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
