import { getData, postData } from "lib/request";

export const listDepartment = async (params: any) => await getData("Department", params);
export const showDepartment = async (params: any) => await getData("Department/show", params);
export const deleteDepartment = async (params: any) => await postData("Department/delete", params);
export const addDepartment = async (params: any) => await postData("Department/create", params);
export const updateDepartment = async (params: any) => await postData("Department/update", params);
export const updateStatusDepartment = async (params: any) => await postData("Department/update/status", params);