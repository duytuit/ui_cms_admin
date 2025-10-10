import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { ProgressBar } from 'primereact/progressbar';
import { listToast } from "utils";
import { getData } from "lib/request";
import { setPermission } from "redux/features/permission";
import { setRoles } from "redux/features/role";
import { showToast } from "redux/features/toast";
import { setUserInfo } from "redux/features/user";

export const HandleExpired = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector((state:any) => state.user);
    useEffect(() => {
        if (userInfo.user === 'token-expired') {
            navigate('/auth/login');
            dispatch(showToast({ ...listToast[2], detail: 'Tài khoản của bạn đã bị vô hiệu hóa' }))
        };
    }, [userInfo]);
};

const Loading = (props:any) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const userInfo = localStorage.getItem('userInfo');
    async function fetchData() {
        const getAuth = await getData('web/auth/get',null);
        if (getAuth.data.status) {
            const userInfo = getAuth.data.data;
            const roles = getAuth.data.rest.permission;
            dispatch(setRoles(roles));
            dispatch(setUserInfo(userInfo));
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        };

        const getPermission = await getData('web/permission_tool_category/getListPermissionToolCateBy',null);
        if (getPermission.data.status) {
            let permission = getPermission.data.data;
            let permissionCate = permission.permission_cate;
            let permissionTool = ['/'];
            if (permissionCate) {
                permissionCate.sort((a:any, b:any) => a.sort - b.sort);
                permissionCate.forEach((item:any) => {
                    if (item.items && item.items[0] && item.items[0].route === '/') {
                        item.route = '/';
                        item.items = undefined;
                    };
                });
            }
            if (permission.permissions_tool) {
                permission.permissions_tool.forEach((item:any) => {
                    if (item.permission) {
                        JSON.parse(item.permission).forEach((p:any) => {
                            let route = '';
                            if (p.action) route = item.route + '/' + p.action;
                            if (p.action === 'view') route = item.route;
                            permissionTool.push(route);
                        })
                    }
                })
            }
            dispatch(setPermission({ permissionTool: permissionTool, permissionCate: permissionCate }));
            setLoading(false);
        };
    };


    return (
           <>
             đây là trang loading
           </>
    )
};

export default Loading;