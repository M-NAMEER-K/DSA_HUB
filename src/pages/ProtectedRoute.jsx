import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setToken, setSignupData } from "../slices/authSlice";
import { checkToken } from "../services/operations/authAPI";

const ProtectedRoute = ({ children, role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.signupData);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await checkToken();
        if (!res.data.success) {
          // Token invalid or expired
          localStorage.removeItem("token");
          localStorage.removeItem("signupData");
          dispatch(setToken(null));
          dispatch(setSignupData(null));
          navigate("/login", { replace: true });
        } else {
          setAuthorized(true); // token valid
        }
      } catch (err) {
        console.log(err);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [dispatch, navigate, token]);

  if (loading) return <p>Checking authentication...</p>;

  // Role check (admin-only)
  if (role && user?.role !== role) {
    return <Navigate to="/problems" replace />;
  }

  if (!authorized) return null;

  return children;
};

export default ProtectedRoute;
