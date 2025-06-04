// src/App.jsx

import React from 'react';
import './App.css';
import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './Pages/HomePage';
import IssuePage from './Pages/issue';
import ForumPage from "./Pages/ForumPage";
import ForumPostPage from './Pages/ForumPostPage';
import ProfilePage from './Pages/profile';
import FunctionPage from "./Pages/FunctionPage";
// import FunctionPage from './Pages/FunctionPage'; // <-- 来自 origin/main

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
