import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

const useUserContext = () => useContext(UserContext);

 const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(""); // Setting an empty string as default

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Exporting individually
export { useUserContext, UserProvider };
