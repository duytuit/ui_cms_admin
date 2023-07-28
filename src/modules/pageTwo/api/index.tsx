import { getData, postData } from "lib/request";

export const getLineData = (params:any) => getData("web/customer/countCustomersAllocatedByMonth", params);
export const getPieData = (params:any) => getData("web/customer/getDetailCustomerStatus", params);
export const getBarData = (params:any) => getData("web/customer/countCustomerOverviewOfManager", params);
export const getScope = (params:any) => getData("web/permission_group_member/getListPermission", params);

export const listCampaign = (params:any) => getData("web/campaign/getListCampaign", params);
export const countCampaign = (params:any) => getData("web/campaign/countCampaign", params);
export const deleteCampaign = (params:any) => postData("web/campaign/deleteCampaign", params);

export const detailCampaign = (params:any) => getData("web/campaign/getDetailCampaign", params);
export const addCampaign = (params:any) => postData("web/campaign/addCampaign", params);
export const updateCampaign = (params:any) => postData("web/campaign/updateCampaign", params);