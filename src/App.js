import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [userRole, setUserRole] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('selectedWidgets');
    localStorage.removeItem('dashboardLayout');
    setUserRole(null); 
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