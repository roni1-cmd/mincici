import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import Login from '@/pages/Login';
import Feed from '@/pages/Feed';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import UsernameSetup from '@/pages/UsernameSetup';
import '@/App.css';

function ProtectedRoute({ children }) {
  const { currentUser, needsUsername } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (needsUsername) {
    return <Navigate to="/username-setup" />;
  }
  
  return children;
}

function UsernameRoute({ children }) {
  const { currentUser, needsUsername } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (!needsUsername) {
    return <Navigate to="/" />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/username-setup"
            element={
              <UsernameRoute>
                <UsernameSetup />
              </UsernameRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
