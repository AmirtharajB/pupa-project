import React, { useState } from 'react';
import AuthApp from './AuthApp';
import DashboardApp from './DashboardApp';

function RootApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLoginSuccess = (user) => {
    setUserData(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  if (isLoggedIn) {
    return <DashboardApp user={userData} onLogout={handleLogout} />;
  }

  return <AuthApp onLoginSuccess={handleLoginSuccess} />;
}

export default RootApp;