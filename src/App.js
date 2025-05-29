import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('selectedWidgets');
    localStorage.removeItem('dashboardLayout');
    localStorage.removeItem('userRole');
    setUserRole(null);
  };

  return (
    <Router>
      <Routes>
        {!userRole ? (
          <>
            <Route path="/" element={<Login onLogin={(role) => setUserRole(role)} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/*" element={<Dashboard role={userRole} onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;