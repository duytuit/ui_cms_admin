import { getData, postData } from "lib/request";

export const listWork = async (params: any) => await getData("Work", params);
export const showWork = async (params: any) => await getData("Work/show", params);
export const deleteWork = async (params: any) => await postData("Work/delete", params);
export const addWork = async (params: any) => await postData("Work/create", params);
export const updateWork = async (params: any) => await postData("Work/update", params);
export const updateStatusWork = async (params: any) => await postData("Work/update/status", params);
export const updateAttachment = async (params: any) => await postData("Work/updateAttachment", params);

// work comment
export const listWorkComment = async (params: any) => await getData("WorkComment", params);
export const showWorkComment = async (params: any) => await getData("WorkComment/show", params);
export const deleteWorkComment = async (params: any) => await postData("WorkComment/delete", params);
export const addWorkComment = async (params: any) => await postData("WorkComment/create", params);
export const updateWorkComment = async (params: any) => await postData("WorkComment/update", params);

// work detail
export const listWorkDetail = async (params: any) => await getData("WorkDetail", params);
export const showWorkDetail = async (params: any) => await getData("WorkDetail/show", params);
export const deleteWorkDetail = async (params: any) => await postData("WorkDetail/delete", params);
export const addWorkDetail = async (params: any) => await postData("WorkDetail/create", params);
export const updateWorkDetail = async (params: any) => await postData("WorkDetail/update", params);
export const ChangeStatusWorkDetail = async (params: any) => await postData("WorkDetail/ChangeStatus", params);
