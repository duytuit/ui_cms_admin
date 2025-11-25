import { getData, postData } from "lib/request";

export const listReceipt = (params:any) => getData("receipt", params);
export const listXacNhanChiPhiGiaoNhan = (params:any) => getData("receipt/XacNhanChiPhiGiaoNhan", params);
export const updateHoanUngGiaoNhan = (params:any) => postData("receipt/update/HoanUngGiaoNhan", params);
export const deleteReceipt = (params:any) => postData("receipt/delete", params);
export const addReceipt = (params:any) => postData("receipt/create", params);
export const addPhieuThuKH = (params:any) => postData("receipt/create/phieuthukh", params);
export const giayHoanUng = (params:any) => postData("receipt/create/giayHoanUng", params);
export const addReceiptChiGiaoNhan = (params:any) => postData("receipt/create/chigiaonhan", params);
export const updateReceiptChiGiaoNhan = (params:any) => postData("receipt/update/chigiaonhan", params);
export const showReceipt = (params:any) => getData("receipt/show", params);
export const showWithDebit = (params:any) => getData("receipt/showWithDebit", params);
export const updateReceipt = (params:any) => postData("receipt/update", params);
export const updateStatusReceipt = (params:any) => postData("receipt/update/status", params);
export const confirmCancelGiaoNhan = (params:any) => postData("receipt/confirmCancelGiaoNhan", params);