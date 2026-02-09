import { getData, postData } from "lib/request";

export const listPermission = async (params: any) => await getData("Permission", params);
export const getRole = async (params: any) => await getData("Permission/role", params);
export const showRole = async (params: any) => await getData("Permission/show", params);
export const addOrUpdate = async (params: any) => await postData("Permission/addOrUpdate", params);
export const delRole = async (params: any) => await postData("Permission/delete", params);