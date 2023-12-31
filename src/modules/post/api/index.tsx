import { getData, postData } from "lib/request";

export const listPost = (params:any) => getData("system/post/v2/list", params);
export const deletePost = (params:any) => postData("system/post/delete", params);
export const addPost = (params:any) => postData("system/post/create", params);
export const updatePost = (params:any) => postData("system/post/update", params);
export const updateStatusPost = (params:any) => postData("system/post/update/status", params);
export const updateSlugPost = (params:any) => postData("system/post/update/slug", params);