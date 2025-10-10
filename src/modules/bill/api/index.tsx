import { getData, postData } from "lib/request";

export const listBill = (params:any) => getData("system/bill/list", params);
export const deleteBill = (params:any) => postData("system/bill/delete", params);
export const addBill = (params:any) => postData("system/bill/create", params);
export const updateBill = (params:any) => postData("system/bill/update", params);
export const updateStatusBill = (params:any) => postData("system/bill/update/status", params);