import { getData, postData } from "lib/request";

export const listCustomer = (params:any) => getData("system/customer/list", params);
export const deleteCustomer = (params:any) => postData("system/customer/delete", params);
export const addCustomer = (params:any) => postData("system/customer/create", params);
export const updateCustomer = (params:any) => postData("system/customer/update", params);
export const updateStatusCustomer = (params:any) => postData("system/customer/update/status", params);