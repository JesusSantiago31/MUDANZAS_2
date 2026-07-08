import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Cotizar from './pages/Cotizar';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes wrapped in MainLayout */}
        <Route path="/" element={<MainLayout user={user} setUser={setUser} />}>
          <Route index element={<Home />} />
          <Route path="cotizar" element={<Cotizar />} />
          <Route path="login" element={<Login setUser={setUser} />} />
          <Route path="registro" element={<Registro setUser={setUser} />} />
        </Route>

        {/* Dashboard route (independent layout, guarded) */}
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <Dashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
        <Route path="/admin/dashboard" element={<AdminDashboard setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
