import { getData, postData } from "lib/request";

export const listDepreciation = async (params: any) => await getData("Depreciation", params);
export const showDepreciation = async (params: any) => await getData("Depreciation/show", params);
export const deleteDepreciation = async (params: any) => await postData("Depreciation/delete", params);
export const addDepreciation = async (params: any) => await postData("Depreciation/create", params);
export const updateDepreciation = async (params: any) => await postData("Depreciation/update", params);
export const updateStatusDepreciation = async (params: any) => await postData("Depreciation/update/status", params);