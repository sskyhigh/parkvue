import { useContext } from "react";
import { useValue, Context } from "../../context/ContextProvider";
import { auth, signOut } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { dispatch } = useValue();
  const { setCurrentUser } = useContext(Context);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
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
