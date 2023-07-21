import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    const userInfo = localStorage.getItem('userInfo');
    let auth = { user: userInfo };
    return (
        auth.user ? <Outlet /> : <Navigate to='/auth/login' />
    )
};

const PublicRoutes = () => {
    const userInfo = localStorage.getItem('userInfo');
    let auth = { user: !userInfo }
    return (
        auth.user ? <Outlet /> : <Navigate to="/" />
    )
};

export { PrivateRoutes, PublicRoutes }