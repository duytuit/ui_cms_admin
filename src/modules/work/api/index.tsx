import { getData, postData } from "lib/request";

export const listWork = async (params: any) => await getData("Work", params);
export const showWork = async (params: any) => await getData("Work/show", params);
export const deleteWork = async (params: any) => await postData("Work/delete", params);
export const addWork = async (params: any) => await postData("Work/create", params);
export const updateWork = async (params: any) => await postData("Work/update", params);
export const updateStatusWork = async (params: any) => await postData("Work/update/status", params);