import { getData, postData } from "lib/request";

export const listUser = async (params: any) => await getData("user", params);
export const deleteUser = async (params: any) => await postData("system/categories/delete", params);
export const addUser = async (params: any) => await postData("system/categories/create", params);
export const updateUser = async (params: any) => await postData("system/categories/update", params);
export const updateStatusUser = async (params: any) => await postData("system/categories/update/status", params);