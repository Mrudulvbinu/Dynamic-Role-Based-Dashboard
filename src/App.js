import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [userRole, setUserRole] = useState(null);

  const handleLogout = () => {
    // Clear any user-related data from storage if needed
    localStorage.removeItem('selectedWidgets');
    localStorage.removeItem('dashboardLayout');
    setUserRole(null); // This will trigger showing the login page
  };

  return (
    <div className="App">
      {!userRole ? (
        <Login onLogin={(role) => setUserRole(role)} />
      ) : (
        <Dashboard role={userRole} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;