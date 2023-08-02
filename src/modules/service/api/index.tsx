import { getData, postData } from "lib/request";

export const listService = (params:any) => getData("system/service/list", params);
export const deleteService = (params:any) => postData("system/service/delete", params);
export const addService = (params:any) => postData("system/service/create", params);
export const updateService = (params:any) => postData("system/service/update", params);
export const updateStatusService = (params:any) => postData("system/service/update/status", params);