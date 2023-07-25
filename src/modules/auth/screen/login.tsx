import { FormInput } from "components/uiCore";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "redux/features/toast";
import { setToken } from "redux/features/token";
import { setUserInfo } from "redux/features/user";
import { loginAPI } from "../api";
import { FormAuth } from "../service";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    async function fetchData() {
        // await new Promise((resolve, reject) => setTimeout(() => {resolve()},5000))
        const response = await loginAPI(user,null);
        if (response) setLoading(false);
        if (response.data.status) {
            const token = response.data.data.token;
            const userInfo = response.data.data.userInfo;
            dispatch(setToken(token));
            dispatch(setUserInfo(userInfo));
            localStorage.setItem('token', token)
            // localStorage.setItem('userInfo', JSON.stringify(userInfo));
            dispatch(
                showToast({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Đăng nhập thành công!',
                })
            );
            // Loading();
            // navigate('/auth/loading');
        } else {
            dispatch(
                showToast({
                    severity: 'error',
                    summary: 'Failed',
                    detail: response.data.mess,
                })
            );
        }
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        setLoading(true);
        fetchData();
    };

    return (
        <FormAuth title='Welcome' subtitle='Sign in to continue' handleSubmit={handleSubmit} lableSubmit='Sign in'
            titleFooter='Forgot password' linkTitleFooter='/auth/forgotpassword' disabled={!user.username || !user.password} loading={loading}>

            <FormInput id='username' label='Username' value={user.username}
                onChange={(e:any) => setUser({ ...user, username: e.target.value })} />

            <FormInput id='password' label='Password' type='password' value={user.password}
                onChange={(e:any) => setUser({ ...user, password: e.target.value })} />

        </FormAuth>
    );
};

export default Login;