import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "redux/features/toast";
import { setToken } from "redux/features/token";
import { loginAPI } from "../api";
import { Button, Checkbox, FormInput, Image } from "components/uiCore";
import { Link } from "react-router-dom";
import { fetchGetCaptcha, useGetCaptcha } from "../service";

const Login = () => {
    const dispatch = useDispatch();
    const [filter, setFilter] = useState({});
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        username: "",
        password: "",
        code: "",
        uuid: ""
    });
    const {data,setData} = useGetCaptcha(filter)
    
    async function fetchData() {
        const response = await loginAPI(user,null);
        if (response) setLoading(false);
        if (response.data.code === 200) {
            const token = response.data.data.token;
            dispatch(setToken(token));
            localStorage.setItem('token', token)
            dispatch(
                showToast({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Đăng nhập thành công!',
                })
            );
        } else {
            dispatch(
                showToast({
                    severity: 'error',
                    summary: 'Failed',
                    detail: response.data.msg,
                })
            );
        }
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        fetchData();
    };
    const resetCaptcha = async()=>{
       const abc = await fetchGetCaptcha({});
       setData(abc);
    }
    return (
      <FormAuth
        title="Welcome"
        subtitle="cms admin"
        handleSubmit={handleSubmit}
        lableSubmit="Sign in"
        titleFooter="Forgot password"
        linkTitleFooter="/auth/forgotpassword"
        disabled={!user.username || !user.password}
        loading={loading}
      >
        <div className="p-fluid">
          <div className="field col">
            <FormInput
              id="username"
              label="Username"
              value={user.username}
              className="p-inputtext-sm"
              onChange={(e: any) =>
                setUser({ ...user, username: e.target.value })
              }
              required
              placeholder="User Name"
            />
          </div>

          <div className="field col">
            <FormInput
              id="password"
              label="Password"
              type="password"
              value={user.password}
              className="p-inputtext-sm"
              onChange={(e: any) =>
                setUser({ ...user, password: e.target.value })
              }
              required
              placeholder="Password"
            />
          </div>
          
        </div>
        <div className="formgrid grid" style={{margin:"0"}}>
            <div className="field col-6">
              <FormInput
                id="verify_code"
                label="Verify Code"
                value={user.code}
                className="p-inputtext-sm"
                onChange={(e: any) =>
                  setUser({ ...user, code: e.target.value, uuid: data.uuid })
                }
                placeholder="Verify Code"
                required
              />
            </div>
            <div className="field col-6">
              <div
                onClick={resetCaptcha}
                dangerouslySetInnerHTML={{ __html: data ? data?.img : "" }}
              ></div>
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
                                            <label htmlFor="rememberme">Remember me</label>
                                        </Fragment>
                                    )}
                                </div>
                                <Link to={linkTitleFooter} className="font-medium no-underline text-right" style={{ color: 'var(--primary-color)' }}>
                                    {titleFooter}
                                </Link>
                            </div>}
                            <Button disabled={disabled} loading={loading} size="small" label={lableSubmit || 'Submit'} className="w-full" ></Button>
                        </form>
                    </div>
            </div>
        </div>
    )
};