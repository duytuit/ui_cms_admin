import { getData } from "lib/request";

export const getLineData = (params:any) => getData("web/customer/countCustomersAllocatedByMonth", params);
export const getPieData = (params:any) => getData("web/customer/getDetailCustomerStatus", params);
export const getBarData = (params:any) => getData("web/customer/countCustomerOverviewOfManager", params);
export const getScope = (params:any) => getData("web/permission_group_member/getListPermission", params);