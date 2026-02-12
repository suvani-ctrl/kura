import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Toaster } from 'react-hot-toast';
import { useauthStore } from './store/Authstore';
import GlobalLoadingScreen from './components/GlobalLoadingScreen';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  const checkAuth = useauthStore(state => state.checkAuth);
  const isCheckingAuth = useauthStore(state => state.isCheckingAuth);
  const authUser = useauthStore(state => state.authUser);

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) return <GlobalLoadingScreen />;

  return (
    <div data-theme="dark" className="min-h-screen w-full bg-dirty-blue-900">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Chat /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;