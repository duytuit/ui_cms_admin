import { getData, postData } from "lib/request";

export const listCategories = (params:any) => getData("system/categories/list", params);
export const deleteCategories = (params:any) => postData("system/categories/delete", params);
export const addCategories = (params:any) => postData("system/categories/create", params);
export const updateCategories = (params:any) => postData("system/categories/update", params);
export const updateStatusCategories = (params:any) => postData("system/categories/update/status", params);