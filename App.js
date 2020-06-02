import React, { useState } from "react";
import AuthenticationNavigator from './navigation/AuthenticationNavigator';
<<<<<<< HEAD
import MainNavigator from './navigation/MainNavigator';
import { LogInContext } from './data/LogInContext';

export default App => {
  const [user, setUser] = useState(null);
  const [authentication, setAuthentication] = useState(false);

  const authHandler = (auth) => {
    if (auth) {
      return ( <MainNavigator /> )
    } else {
      return ( <AuthenticationNavigator /> )
    }
  }

  return (
    <LogInContext.Provider value={[authentication, setAuthentication, user, setUser]}>
        {authHandler(authentication)}
    </LogInContext.Provider>
=======

export default App => {
  return (
      <AuthenticationNavigator />
>>>>>>> a43f41048d95d9e92f3effc95e0f4f8c67132882
  )
};

