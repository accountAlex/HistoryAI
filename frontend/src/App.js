import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/AuthPage';
import TimelinePage from './pages/TimelinePage';
import ArticlesPage from './pages/ArticlesPage';
import BiographiesPage from './pages/BiographiesPage';
import BiographyDetailPage from './pages/BiographyDetailPage';
import PopularPage from './pages/PopularPage';
import './styles/App.css';
import ScrollToTop from "./components/scroll/ScrollToTop";

const PrivateRoute = ({ children }) => {
  const token = Cookies.get('jwtToken');
  if (!token || token.trim() === '') {
    return <Navigate to="/auth" />;
  }
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      Cookies.remove('jwtToken');
      return <Navigate to="/auth" />;
    }
  } catch (err) {
    Cookies.remove('jwtToken');
    return <Navigate to="/auth" />;
  }
  return children;
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = Cookies.get('jwtToken');
    if (!token || token.trim() === '') {
      if (location.pathname !== '/auth') {
        navigate('/auth');
      }
      return;
    }
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        Cookies.remove('jwtToken');
        if (location.pathname !== '/auth') {
          navigate('/auth');
        }
      }
    } catch (err) {
      Cookies.remove('jwtToken');
      if (location.pathname !== '/auth') {
        navigate('/auth');
      }
    }
  }, [navigate, location]);

  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/chat" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="/chat/:uuid" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="/timeline" element={<PrivateRoute><TimelinePage /></PrivateRoute>} />
        <Route path="/articles" element={<PrivateRoute><ArticlesPage /></PrivateRoute>} />
        <Route path="/biographies" element={<PrivateRoute><BiographiesPage /></PrivateRoute>} />
        <Route path="/biographies/:url" element={<PrivateRoute><BiographyDetailPage /></PrivateRoute>} />
        <Route path="/popular" element={<PrivateRoute><PopularPage /></PrivateRoute>} />
      </Routes>
    </div>
  );
};

export default App;