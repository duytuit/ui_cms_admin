import { getData, postData } from "lib/request";

export const GetObjectTaskAsync = (params:any) => getData("bill/GetObjectTaskAsync", params);
export const deleteBill = (params:any) => postData("bill/delete", params);
export const addBill = (params:any) => postData("bill/create", params);
export const updateBill = (params:any) => postData("system/bill/update", params);
export const updateStatusBill = (params:any) => postData("system/bill/update/status", params);