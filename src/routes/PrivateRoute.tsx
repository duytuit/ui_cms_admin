import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    const token = localStorage.getItem('token');
    return (
       <Outlet />
    )
};
const PublicRoutes = () => {
    const userInfo = localStorage.getItem('token');
    let auth = { user: !userInfo }
    return (
        auth.user ? <Outlet /> : <Navigate to="/" />
    )
};
export { PrivateRoutes,PublicRoutes }