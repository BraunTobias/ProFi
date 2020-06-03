import React, { useState } from "react";
import AuthenticationNavigator from './navigation/AuthenticationNavigator';
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

  const bla = 0;

  return (
    <LogInContext.Provider value={[authentication, setAuthentication, user, setUser]}>
        {authHandler(authentication)}
    </LogInContext.Provider>
  )
};

