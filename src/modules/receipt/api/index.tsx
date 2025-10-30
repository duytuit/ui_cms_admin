import { getData, postData } from "lib/request";

export const listReceipt = (params:any) => getData("receipt", params);
export const deleteReceipt = (params:any) => postData("receipt/delete", params);
export const addReceipt = (params:any) => postData("receipt/create", params);
export const showReceipt = (params:any) => postData("receipt/show", params);
export const updateReceipt = (params:any) => postData("receipt/update", params);
export const updateStatusReceipt = (params:any) => postData("receipt/update/status", params);