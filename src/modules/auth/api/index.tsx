import { clientApi } from "utils/axios";

async function postAuth(url:any, params:any, config:any) {
    return await clientApi.post(url, params);
};

export const loginAPI = (param:any, config:any) => postAuth("/web/auth/login", param, config);
export const forgotPasswordAPI = (param:any, config:any) => postAuth("/web/auth/forgetAccount", param, config);
export const verifyAccountAPI = (param:any, config:any) => postAuth("/web/auth/verifyAccount", param, config);
export const setPasswordAPI = (param:any, config:any) => postAuth("/web/auth/setPword", param, config);
export const changePasswordAPI = (param:any, config:any) => postAuth("/web/auth/changePword", param, config);