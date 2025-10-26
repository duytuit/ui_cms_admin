import { getData, postData } from "lib/request";

export const listDebit = async (params: any) => await getData("Debit", params);
export const showDebit = async (params: any) => await getData("Debit/show", params);
export const deleteDebit = async (params: any) => await postData("Debit/delete", params);
export const addDebit = async (params: any) => await postData("Debit/create", params);
export const updateDebit = async (params: any) => await postData("Debit/update", params);
export const updateStatusDebit = async (params: any) => await postData("Debit/update/status", params);