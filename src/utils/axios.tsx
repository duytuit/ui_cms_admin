import axios from "axios";
import { clientId } from "./getClinentId";
import { showToast } from "redux/features/toast";
import store from "redux/store";

export const clientApi = axios.create({
    // axios Cấu hình yêu cầu được cấu hình với tùy chọn BaseURL, cho biết rằng phần công khai URL yêu cầu
    baseURL: process.env.REACT_APP_API_URL+'api/',
    // hết giờ
    timeout: 10000,
    headers: {
        "Accept":  `application/json`
    },
})

// Add a request interceptor
clientApi.interceptors.request.use(

     config => {
         const token = store.getState().token.token || localStorage.getItem('token');
         if(token){
            console.log(token);
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['info'] = JSON.stringify({ "client_id": `${clientId}`, "build": 1, "device_name": "remix", "js_ver": "v1", "native_ver": "201", "os": "android", "os_ver": "111", "bundle_id": "123", "type": "user" })
            return config;
         }
         return config;},
    error => {
        return Promise.reject(error);
    });

//Add a response interceptor
clientApi.interceptors.response.use(
    // ===== SUCCESS =====
    async function (res) {
        if (res.data?.code === 401) {
            localStorage.removeItem('token');
        }
        return res;
    },

    // ===== ERROR =====
    async function (error) {
        // Mất kết nối backend — CHẶN VÒNG LẶP Ở ĐÂY
        if (error.code === "ERR_NETWORK") {
            // Không retry — trả lỗi để UI xử lý
            return Promise.reject(error);
        }

        // Trường hợp 401 từ server
        if (error?.response?.status === 401) {
            localStorage.removeItem('token');
        }

        store.dispatch(showToast({
            severity: 'error',
            summary: 'Error',
            detail: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!'
        }));

        // Nên reject để UI biết là request failed
        return Promise.reject(error);
    },
);