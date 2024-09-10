import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux'; // get the state

// Outlet is what we want to return if we're logged in,
const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />; // to replace any past history
};
export default PrivateRoute;
