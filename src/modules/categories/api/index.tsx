import { getData, postData } from "lib/request";

export const listServiceCategory = (params:any) => getData("ServiceCategory", params);
export const deleteServiceCategory = (params:any) => postData("ServiceCategory/delete", params);
export const addServiceCategory = (params:any) => postData("ServiceCategory/create", params);
export const updateServiceCategory = (params:any) => postData("ServiceCategory/update", params);
export const updateStatusServiceCategory = (params:any) => postData("ServiceCategory/update/status", params);

export const listIncomeExpense = (params:any) => getData("IncomeExpense", params);
export const deleteIncomeExpense = (params:any) => postData("IncomeExpense/delete", params);
export const addIncomeExpense = (params:any) => postData("IncomeExpense/create", params);
export const updateIncomeExpense = (params:any) => postData("IncomeExpense/update", params);
export const updateStatusIncomeExpense = (params:any) => postData("IncomeExpense/update/status", params);