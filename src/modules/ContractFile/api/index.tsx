import { getData, postData } from "lib/request";

export const listContractFile = async (params: any) => await getData("ContractFile", params);
export const deleteContractFile = async (params: any) => await postData("ContractFile/delete", params);
export const addContractFile = async (params: any) => await postData("ContractFile/create", params);
export const updateContractFile = async (params: any) => await postData("ContractFile/update", params);
export const updateStatusContractFile = async (params: any) => await postData("ContractFile/update/status", params);