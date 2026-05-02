import { getData, postData } from "lib/request";

export const listDepreciation = async (params: any) => await getData("Depreciation", params);
export const listDepreciationAllocation = async (params: any) => await getData("Depreciation/allocation", params);
export const showDepreciation = async (params: any) => await getData("Depreciation/show", params);
export const getDepreciationAllocationDetailByDepreciationAllocationId = async (params: any) => await getData("Depreciation/getDepreciationAllocationDetailByDepreciationAllocationId", params);
export const deleteDepreciation = async (params: any) => await postData("Depreciation/delete", params);
export const deleteDepreciationAllocation = async (params: any) => await postData("Depreciation/deleteAllocation", params);
export const updateDepreciationAllocation = async (params: any) => await postData("Depreciation/updateDepreciationAllocation", params);
export const addDepreciation = async (params: any) => await postData("Depreciation/create", params);
export const updateDepreciation = async (params: any) => await postData("Depreciation/update", params);
export const updateStatusDepreciation = async (params: any) => await postData("Depreciation/update/status", params);