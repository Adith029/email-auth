import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import UserProfile from './components/Profile/UserProfile';
import AdminDashboard from './components/Profile/AdminDashboard';
import { isAuthenticated, getUser } from './utils/auth';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(() => getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated() && !user) {
        try {
          const response = await axios.get(`http://localhost:3001/api/auth/profile`);
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            isAuthenticated() ? <UserProfile /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated() && user?.role === 'Admin'
              ? <AdminDashboard />
              : <Navigate to="/login" />
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
