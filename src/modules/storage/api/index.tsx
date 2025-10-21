import { getData, postData } from "lib/request";

export const listStorage = async (params: any) => await getData("Storages", params);
export const showStorage = async (params: any) => await getData("Storages/show", params);
export const deleteStorage = async (params: any) => await postData("Storages/delete", params);
export const addStorage = async (params: any) => await postData("Storages/create", params);
export const updateStorage = async (params: any) => await postData("Storages/update", params);
export const updateStatusStorage = async (params: any) => await postData("Storages/update/status", params);