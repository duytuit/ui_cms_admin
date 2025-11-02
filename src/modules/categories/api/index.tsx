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

export const listBank = (params:any) => getData("Bank", params);
export const deleteBank = (params:any) => postData("Bank/delete", params);
export const addBank = (params:any) => postData("Bank/create", params);
export const updateBank = (params:any) => postData("Bank/update", params);
export const updateStatusBank = (params:any) => postData("Bank/update/status", params);

export const listFundCategory = (params:any) => getData("FundCategory", params);
export const deleteFundCategory = (params:any) => postData("FundCategory/delete", params);
export const addFundCategory = (params:any) => postData("FundCategory/create", params);
export const updateFundCategory = (params:any) => postData("FundCategory/update", params);
export const updateStatusFundCategory = (params:any) => postData("FundCategory/update/status", params);