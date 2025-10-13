import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    const token = localStorage.getItem('token');
     if(token){
        return (
            <Outlet  />
        )
     }  
    return <Navigate to="/auth/login" />;
};
const PublicRoutes = () => {
    return (
       <Outlet /> 
    )
};
export { PrivateRoutes, PublicRoutes }