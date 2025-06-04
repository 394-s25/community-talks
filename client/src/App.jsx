// src/App.jsx

import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import ForumPage from "./pages/ForumPage.jsx";
import ForumPostPage from './pages/ForumPostPage.jsx';
import FunctionPage from "./pages/FunctionPage.jsx";
import HomePage from './pages/HomePage.jsx';
import IssuePage from './pages/issue.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/profile.jsx';
import CalEvents from './components/CalEvents.jsx';
// import FunctionPage from './Pages/FunctionPage'; 

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
          <Route path="/calendar" element={<CalEvents/>} />


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
