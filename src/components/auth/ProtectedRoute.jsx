import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Temp Bypass because Backend Login is not implemented yet
    // if (!isAuthenticated) {
    //     return <Navigate to="/login" state={{ from: location }} replace />;
    // }

    return children;
};

export default ProtectedRoute;
