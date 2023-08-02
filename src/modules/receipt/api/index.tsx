import { getData, postData } from "lib/request";

export const listReceipt = (params:any) => getData("system/receipt/list", params);
export const deleteReceipt = (params:any) => postData("system/receipt/delete", params);
export const addReceipt = (params:any) => postData("system/receipt/create", params);
export const updateReceipt = (params:any) => postData("system/receipt/update", params);
export const updateStatusReceipt = (params:any) => postData("system/receipt/update/status", params);