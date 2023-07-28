import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/auth";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const auth = getAuth();
  useEffect(() => {
    /**
     * Verifies if a user is logged in
     */
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //User is logged in
        setUser(user);
        setIsAuthenticated(true);
      } else {
        //User is not logged in
        setUser(null);
        setIsAuthenticated(false);
        navigate("/Login", { replace: true });
      }
    });
  }, []);

  return isAuthenticated;
}
