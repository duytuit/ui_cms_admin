import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    const userInfo = localStorage.getItem('userInfo');
    let auth = { user: {
        abc:''
    } };
    // console.log('userInfo',auth);
    return (
        auth.user ? <Outlet /> : <Navigate to='/auth/login' />
    )
};

const PublicRoutes = () => {
    const userInfo = localStorage.getItem('userInfo');
    // console.log('userInfo',userInfo);
    
    // let auth = { user: !userInfo }
    let auth = { user: {
        abc:''
    } };
    return (
        auth.user ? <Outlet /> : <Navigate to="/" />
    )
};

export { PrivateRoutes, PublicRoutes }