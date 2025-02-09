import React, { createContext, useContext, useState } from "react";

// Create a context for managing the search query state
const SearchQueryContext = createContext();

// Custom hook to access the search query state and setter
export const useSearchQuery = () => useContext(SearchQueryContext);

// Provider component to wrap the components that need access to the search query state
export const SearchQueryProvider = ({ children }) => {
  const [searchQueryGlobal, setSearchQueryGlobal] = useState("");

  return (
    <SearchQueryContext.Provider value={{ searchQueryGlobal, setSearchQueryGlobal }}>
      {children}
    </SearchQueryContext.Provider>
  );
};

export default {useSearchQuery,SearchQueryProvider}