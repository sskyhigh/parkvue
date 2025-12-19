import { useContext } from "react";
import { useValue, Context } from "../../context/ContextProvider";
import { auth, signOut } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { rtdb } from "../../firebase/config";
import { ref, remove } from "firebase/database";

const Logout = () => {
  const { dispatch, currentUser } = useValue();
  const { setCurrentUser } = useContext(Context);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const uid = currentUser?.uid;
      await signOut(auth);
      if (uid) {
        remove(ref(rtdb, `presence/${uid}`));
      }
      localStorage.removeItem("userData");
      sessionStorage.removeItem("userData");
      setCurrentUser("");
      navigate("/");
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
};

export default Logout;
