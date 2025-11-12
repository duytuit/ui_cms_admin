import { getData, postData } from "lib/request";

export const listContractFile = async (params: any) => await getData("ContractFile", params);
export const listContractFileNotDispatch = async (params: any) => await getData("ContractFile/getFileNotDispatch", params);
export const listContractFileNotService = async (params: any) => await getData("ContractFile/getFileNotService", params);
export const listContractFileHasDebitService = async (params: any) => await getData("ContractFile/getFileHasDebitService", params);
export const listContractFileHasDebitNangHa = async (params: any) => await getData("ContractFile/getFileHasDebitNangHa", params);
export const listContractFileNotDebitNangHa = async (params: any) => await getData("ContractFile/getFileNotDebitNangHa", params);
export const getCodeContractFile = async (params: any) => await getData("ContractFile/codeFile", params);
export const listSelectContractFile = async (params: any) => await getData("ContractFile/select", params);
export const showContractFile = async (params: any) => await getData("ContractFile/show", params);
export const deleteContractFile = async (params: any) => await postData("ContractFile/delete", params);
export const addContractFile = async (params: any) => await postData("ContractFile/create", params);
export const updateContractFile = async (params: any) => await postData("ContractFile/update", params);
export const updateStatusContractFile = async (params: any) => await postData("ContractFile/update/status", params);