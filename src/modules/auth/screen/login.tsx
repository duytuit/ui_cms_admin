import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "redux/features/toast";
import { setToken } from "redux/features/token";
import { loginAPI } from "../api";
import { Button, Checkbox, FormInput, Image } from "components/uiCore";
import { Link, useNavigate } from "react-router-dom";
import { fetchGetCaptcha, useGetCaptcha } from "../service";
import { clientId } from "utils/getClinentId";
const Login = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState({
        Username: "",
        Password: "",
        code: "",
        uuid: "",
        DeviceId:clientId
    });
    //const {data,setData} = useGetCaptcha(filter)
    async function fetchData() {
        const response = await loginAPI(user,null);
        if (response) setLoading(false);
         console.log(response.data);
        if (response.status === 200 && response.data.status) {
          const token = response.data.data.accessToken;
            dispatch(setToken(token));
            dispatch(
                showToast({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Đăng nhập thành công!',
                })
            );
            navigate('/'); // Chuyển hướng đến trang chính sau khi đăng nhập thành công
        } else {
            console.log(response.data);
            dispatch(
                showToast({
                    severity: 'error',
                    summary: 'Failed',
                    detail: response.data.message,
                })
            );
        }
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        setLoading(true)
        fetchData();
    };
    return (
      <FormAuth
        title="Hệ thống quản trị"
        subtitle=" "
        handleSubmit={handleSubmit}
        lableSubmit="Đăng nhập"
        titleFooter="Quên mật khẩu?"
        linkTitleFooter="/auth/forgotpassword"
        disabled={!user.Username || !user.Password}
        loading={loading}
      >
        <div className="p-fluid">
          <div className="field col">
            <FormInput
              id="Username"
              label="Tài khoản"
              value={user.Username}
              className="p-inputtext-sm"
              onChange={(e: any) =>
                setUser({ ...user, Username: e.target.value })
              }
              required
              placeholder="Tài khoản"
            />
          </div>

          <div className="field col">
            <FormInput
              id="Password"
              label="Mật khẩu"
              type="password"
              value={user.Password}
              className="p-inputtext-sm"
              onChange={(e: any) =>
                setUser({ ...user, Password: e.target.value })
              }
              placeholder="Mật khẩu"
            />
          </div>
        </div>
      </FormAuth>
    );
};

export default Login;


export const FormAuth = (props:any) => {
    const { title, subtitle, linkSubtitle, handleSubmit, lableSubmit, titleFooter, linkTitleFooter, loading, rememberPassword, disabled } = props;

    return (
        <div className='surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden'>
            <div className="flex flex-column align-items-center justify-content-center" style={{width:'600px'}}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '5px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">{title}</div>
                            {linkSubtitle ? (
                                <Link to={linkSubtitle}>
                                    <Button icon="pi pi-arrow-left" label={subtitle} text />
                                </Link>
                            ) : <span className="text-600 font-medium">{subtitle}</span>}
                        </div>

                        <form onSubmit={handleSubmit}>
                            {props.children}

                            {titleFooter && <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    {rememberPassword && (
                                        <Fragment>
                                            <Checkbox checked={false} className="mr-2"></Checkbox>
                                            <label htmlFor="rememberme">Nhớ mật khẩu</label>
                                        </Fragment>
                                    )}
                                </div>
                                {/* <Link to={linkTitleFooter} className="font-medium no-underline text-right" style={{ color: 'var(--primary-color)' }}>
                                    {titleFooter}
                                </Link> */}
                            </div>}
                            <Button disabled={disabled} loading={loading} size="small" label={lableSubmit || 'Submit'} className="w-full" ></Button>
                        </form>
                    </div>
            </div>
        </div>
    )
};