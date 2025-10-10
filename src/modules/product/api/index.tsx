import { getData, postData } from "lib/request";

export const listProduct = (params:any) => getData("system/product/list", params);
export const deleteProduct = (params:any) => postData("system/product/delete", params);
export const addProduct = (params:any) => postData("system/product/create", params);
export const updateProduct = (params:any) => postData("system/product/update", params);
export const updateStatusProduct = (params:any) => postData("system/product/update/status", params);