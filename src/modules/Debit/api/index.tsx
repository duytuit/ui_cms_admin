import { getData, getDataV3, postData, postDataList } from "lib/request";

export const listDebit = async (params: any) => await getData("Debit", params);
export const listMuahangNCC = async (params: any) => await getData("Debit/muahangNCC", params);
export const listBanhangKH = async (params: any) => await getData("Debit/banhangKH", params);
export const listNoDebitNoFileNCC= async (params: any) => await getData("Debit/noDebitNoFileNCC", params);
export const listHasDebitNoFileNCC= async (params: any) => await getData("Debit/hasDebitNoFileNCC", params);
export const listNoDebitNoFileDispatchKH = async (params: any) => await getData("Debit/noDebitNoFileDispatchKH", params);
export const listHasDebitNoFileDispatchKH= async (params: any) => await getData("Debit/hasDebitNoFileDispatchKH", params);
export const listDebitCongNoTongHopKH = async (params: any) => await getData("Debit/congnotonghopkh", params);
export const listDebitCongNoTongHopNCC = async (params: any) => await getData("Debit/congnotonghopncc", params);
export const listDebitCongNoChiTietKH = async (params: any) => await getData("Debit/congnochitietkh", params);
export const listDebitCongNoChiTietNCC = async (params: any) => await getData("Debit/congnochitietncc", params);
export const listCongNoGiaoNhan = async (params: any) => await getData("Debit/congNoGiaoNhan", params);
export const listCongNoLaiXe = async (params: any) => await getData("Debit/congNoLaiXe", params);
export const listDebitMuaBan = async (params: any) => await getData("Debit/muaban", params);
export const listDebitDauKyKH = async (params: any) => await getData("Debit/daukykh", params);
export const listDebitDauKyNCC = async (params: any) => await getData("Debit/daukyncc", params);
export const listDebitDispatch = async (params: any) => await getData("Debit/dispatch", params);
export const listDebitCuocTamThu = async (params: any) => await getData("Debit/cuoctamthu", params);
export const listDebitService = async (params: any) => await getData("Debit/service", params);
export const showDebit = async (params: any) => await getData("Debit/show", params);
export const ShowWithFileInfoAsync = async (params: any) => await getData("Debit/ShowWithFileInfoAsync", params);
export const showDebitByFileId = async (params: any) => await getData("Debit/show/byFileId", params);
// xóa debit khách hàng
export const deleteDebit = async (params: any) => await postData("Debit/delete", params);
export const deleteMultiDebit = async (params: any) => await postData("Debit/delete/multi", params);
export const delMultiDebit = async (params: any) => await postData("Debit/delete/multiDebit", params);
//===== end ===========
// xóa debit nhà cung cấp
export const deleteDebitNCC = async (params: any) => await postData("Debit/deleteDebitNCC", params);
//===== end ===========
// cập nhật debit khách hàng
export const updateDebitToStatusDichVu = async (params: any) => await postData("Debit/updateDebitToStatusDichVu", params);
export const updateDebit = async (params: any) => await postData("Debit/updateDebit", params);
export const updateDebitFileGia = async (params: any) => await postData("Debit/updateFileGia", params);
export const updateVATDebitFileGia = async (params: any) => await postData("Debit/updateVATFileGia", params);
export const updateVATDebitNoFile = async (params: any) => await postData("Debit/updateVATDebitNoFile", params);
export const updateBillCustomerFileGia = async (params: any) => await postData("Debit/updateBillCustomerFileGia", params);
export const updateBillCustomerFileNoFile = async (params: any) => await postData("Debit/updateBillDebitNoFile", params);
export const updateDebitBanHangKH = async (params: any) => await postData("Debit/update/banhang", params);
export const updateDebitDauKyKH = async (params: any) => await postData("Debit/update/daukykh", params);
//===== end ===========
// cập nhật debit nhà cung cấp
export const updateDebitDauKyNCC = async (params: any) => await postData("Debit/update/daukyncc", params);
export const updateBillDebitNCC = async (params: any) => await postData("Debit/updateBillDebitNCC", params);
export const updateDebitNCC = async (params: any) => await postData("Debit/updateDebitNCC", params);
export const updateDebitMuaHangNCC = async (params: any) => await postData("Debit/update/muahang", params);
//===== end ===========
// confirm debit
export const confirmFileGia = async (params: any) => await postData("Debit/confirmFileGia", params);
export const confirmDebitNoFileDispatchKH = async (params: any) => await postData("Debit/confirmDebitNoFileDispatchKH", params);
export const confirmChiPhiHaiQuan = async (params: any) => await postData("Debit/confirmChiPhiHaiQuan", params);
//===== end ===========
export const addDebit = async (params: any) => await postData("Debit/create", params);
export const importDebitDauKyKH = async (params: any) => await postData("Debit/importDauKy", params);
export const importDebitDauKyNCC = async (params: any) => await postData("Debit/importDauKyNCC", params);
export const addDebitDauKyKH = async (params: any) => await postData("Debit/create/daukykh", params);
export const addDebitDauKyNCC = async (params: any) => await postData("Debit/create/daukyncc", params);
export const addDebitMuaBan= async (params: any) => await postData("Debit/create/muaban", params);
export const addDebitService = async (params: any) => await postData("Debit/service/create", params);
export const addDebitNangha = async (params: any) => await postData("Debit/nangha/create", params);
export const addDebitMuaHangNCC = async (params: any) => await postData("Debit/create/muahang", params);
export const addDebitBanHangKH = async (params: any) => await postData("Debit/create/banhang", params);
export const showWithIds = async (params: any) => await postData("Debit/showWithIds", params);
export const exportDebitKH = async (params: any) => await getDataV3("Debit/excel/congnokh", params);
export const exportDebitKHVer1 = async (params: any) => await getDataV3("Debit/excel/congnokh_v1", params);
export const listDebitDoiTruNCC = async (params: any) => await getData("Debit/congnodoitruncc", params);
export const listDebitDoiTruKH = async (params: any) => await getData("Debit/congnodoitrukh", params);
export const listDebitDuNoDKKH = async (params: any) => await getData("Debit/GetObjectDebitDuNoDKKHAsync", params);
export const listDebitDuNoDKNCC = async (params: any) => await getData("Debit/GetObjectDebitDuNoDKNCCAsync", params);
export const listNoDebitNCC = async (params: any) => await getData("Debit/GetObjectNoDebitNCCAsync", params);
export const listHasDebitNCC = async (params: any) => await getData("Debit/GetObjectHasDebitNCCAsync", params);
