import { useContext, useEffect, useRef } from "react";
import { useValue, Context } from "../../context/ContextProvider";
import { auth, signOut } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { rtdb } from "../../firebase/config";
import { ref, remove } from "firebase/database";

const Logout = () => {
  const { dispatch, currentUser } = useValue();
  const { setCurrentUser } = useContext(Context);
  const navigate = useNavigate();
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;

    const handleLogout = async () => {
      try {
        const uid = currentUser?.uid;

        // Clear storage FIRST to prevent any re-hydration
        localStorage.removeItem("userData");
        sessionStorage.removeItem("userData");

        // Clear user state immediately
        setCurrentUser("");

        // Then perform async cleanup
        await signOut(auth);

        if (uid) {
          await remove(ref(rtdb, `presence/${uid}`));
        }

        // Navigate after a brief delay to ensure state update has propagated
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 0);
      } catch (error) {
        dispatch({
          type: "UPDATE_ALERT",
          payload: {
            open: true,
            severity: "error",
            message: "Couldn't logout",
          },
        });
      }
    };

    handleLogout();
  }, [currentUser, dispatch, navigate, setCurrentUser]);

  return null;
};

export default Logout;
