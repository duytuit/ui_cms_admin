import { getData, postData } from "lib/request";

export const listUser = (params:any) => getData("user", params);
export const deleteUser = (params:any) => postData("system/categories/delete", params);
export const addUser = (params:any) => postData("system/categories/create", params);
export const updateUser = (params:any) => postData("system/categories/update", params);
export const updateStatusUser = (params:any) => postData("system/categories/update/status", params);