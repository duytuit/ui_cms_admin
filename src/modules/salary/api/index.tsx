import { getData, postData } from "lib/request";

export const listPayrollPeriod = async (params: any) => await getData("PayrollPeriod", params);
export const listFormRequest = async (params: any) => await getData("FormRequest", params);
export const showPayrollPeriod = async (params: any) => await getData("PayrollPeriod/show", params);
export const deletePayrollPeriod = async (params: any) => await postData("PayrollPeriod/delete", params);
export const addPayrollPeriod = async (params: any) => await postData("PayrollPeriod/create", params);
export const updatePayrollPeriod = async (params: any) => await postData("PayrollPeriod/update", params);