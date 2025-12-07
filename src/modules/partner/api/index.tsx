import { getData, postData } from "lib/request";

export const listPartner = async (params: any) => await getData("Partner", params);
export const listPartnerDetail = async (params: any) => await getData("Partner/PartnerDetail", params);
export const GetPartnerKHAndNCCDetail = async (params: any) => await getData("Partner/GetPartnerKHAndNCCDetail", params);
export const showPartner = async (params: any) => await getData("Partner/show", params);
export const deletePartner = async (params: any) => await postData("Partner/delete", params);
export const addPartner = async (params: any) => await postData("Partner/create", params);
export const updatePartner = async (params: any) => await postData("Partner/update", params);
export const updateStatusPartnerDetail = async (params: any) => await postData("Partner/PartnerDetail/change-status", params);