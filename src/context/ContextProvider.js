import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import reducer from "./reducer";
import {
  auth,
  signOut,
  onAuthStateChanged,
  db,
  collection,
  query,
  where,
  getDocs,
} from "../firebase/config";

// Initial global state containing default values
const initialState = {
  alert: { open: false, severity: "info", message: "" },
  images: [],
  loading: false,
  details: { title: "", description: "", price: 0 },
  location: { lng: 0, lat: 0 },
  chat: { open: false, user: null },
  currentUser: "",
};

// Create a context for easy access to state and dispatch
export const Context = createContext(initialState);

// Hook to easily access context values
export const useValue = () => useContext(Context);

// Helper function to get the current user from storage
const getStoredUser = () => {
  const savedUser =
    sessionStorage.getItem("userData") || localStorage.getItem("userData");

  if (!savedUser) return "";

  try {
    const parsed = JSON.parse(savedUser);
    return parsed && typeof parsed === "object" ? parsed : "";
  } catch {
    // Corrupt storage should never crash the app
    sessionStorage.removeItem("userData");
    localStorage.removeItem("userData");
    return "";
  }
};

const clearStoredUser = () => {
  sessionStorage.removeItem("userData");
  localStorage.removeItem("userData");
};

const persistUser = (user) => {
  const serialized = JSON.stringify(user);
  sessionStorage.setItem("userData", serialized);
  localStorage.setItem("userData", serialized);
};

const safeSignOut = async () => {
  try {
    await signOut(auth);
  } catch {
    // ignore
  }
};

const normalizeAuthErrorCode = (error) => {
  if (!error) return "";
  if (typeof error === "string") return error;
  return String(error.code || error.message || "");
};

const isAuthUserInvalidOrDisabled = (error) => {
  const code = normalizeAuthErrorCode(error);
  return (
    code.includes("auth/user-disabled") ||
    code.includes("auth/user-not-found") ||
    code.includes("auth/invalid-user-token") ||
    code.includes("auth/user-token-expired")
  );
};

// Context provider to wrap around components that need access to global state
const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentUser, setCurrentUser] = useState(getStoredUser); // Initialize currentUser from storage
  const didRefreshUserRef = useRef(false);

  // Keep reducer state in sync for any components reading state.currentUser
  useEffect(() => {
    dispatch({ type: "UPDATE_USER", payload: currentUser || "" });
  }, [currentUser]);

  // Refresh user from DB once per visit (mount)
  useEffect(() => {
    if (didRefreshUserRef.current) return;
    didRefreshUserRef.current = true;

    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (cancelled) return;

      // If Firebase Auth has no user, user is effectively logged out.
      if (!firebaseUser) {
        clearStoredUser();
        setCurrentUser("");
        return;
      }

      // Force a token refresh to detect disabled / invalid sessions.
      try {
        await firebaseUser.reload();
        await firebaseUser.getIdToken(true);
      } catch (error) {
        if (isAuthUserInvalidOrDisabled(error)) {
          clearStoredUser();
          setCurrentUser("");
          await safeSignOut();
          return;
        }
        // transient error (offline, permission, etc) -> keep stored user for now
        console.warn("Failed to validate auth user", error);
        return;
      }

      // Auth user is valid: now fetch the latest user profile from Firestore.
      try {
        const q = query(collection(db, "users"), where("uid", "==", firebaseUser.uid));
        const querySnapshot = await getDocs(q);
        if (cancelled) return;

        if (querySnapshot.empty) {
          // If the DB user doc is missing, treat as no longer valid for the app.
          clearStoredUser();
          setCurrentUser("");
          await safeSignOut();
          return;
        }

        const storedUser = getStoredUser();
        const userDoc = querySnapshot.docs[0];
        const freshData = userDoc.data() || {};

        const authBackfill = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || (storedUser && storedUser.email) || "",
          photoURL: firebaseUser.photoURL || (storedUser && storedUser.photoURL) || null,
          displayName:
            firebaseUser.displayName || (storedUser && storedUser.displayName) || "",
          fullName:
            (freshData && freshData.fullName) ||
            firebaseUser.displayName ||
            (storedUser && storedUser.fullName) ||
            (storedUser && storedUser.displayName) ||
            "",
        };

        const mergedUser = {
          ...(storedUser && typeof storedUser === "object" ? storedUser : {}),
          ...authBackfill,
          ...freshData,
          userDocId: userDoc.id,
        };

        persistUser(mergedUser);
        setCurrentUser(mergedUser);
      } catch (error) {
        // If profile fetch fails, keep whatever we already have.
        console.warn("Failed to refresh user profile from DB", error);
      }
    });

    return () => {
      cancelled = true;
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

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
