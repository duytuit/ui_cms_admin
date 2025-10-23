import { getData, postData } from "lib/request";

export const listEmployee = async (params: any) => await getData("employee", params);
export const showEmployee = async (params: any) => await getData("employee/show", params);
export const deleteEmployee = async (params: any) => await postData("employee/delete", params);
export const addEmployee = async (params: any) => await postData("employee/create", params);
export const updateEmployee = async (params: any) => await postData("employee/update", params);
export const updateStatusEmployee = async (params: any) => await postData("employee/update/status", params);