import { createContext, useContext, useReducer, useState } from "react";
import reducer from "./reducer";

// Initial global state containing default values
const initialState = {
  alert: { open: false, severity: "info", message: "" },
  images: [],
  details: { title: "", description: "", price: 0 },
  location: { lng: 0, lat: 0 },
};

// Create a context for easy access to state and dispatch
export const Context = createContext(initialState);

// Hook to easily access context values
export const useValue = () => useContext(Context);

// Helper function to get the current user from storage
const getStoredUser = () => {
  const savedUser =
    sessionStorage.getItem("userData") || localStorage.getItem("userData");
  return savedUser ? JSON.parse(savedUser) : ""; // Return firstName if user data exists
};

// Context provider to wrap around components that need access to global state
const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentUser, setCurrentUser] = useState(getStoredUser); // Initialize currentUser from storage

  // Return the context provider with state, dispatch, and currentUser-related methods
  return (
    <Context.Provider
      value={{
        state,
        dispatch,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
