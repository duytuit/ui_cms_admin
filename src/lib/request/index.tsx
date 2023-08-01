import { clientApi } from "../../utils/axios";
import { createFormData, convertData } from "./client";

export const postData = (url:any, data:any, isUpload = false, timeout = 600000) => {
    if (isUpload) {
        const { file, files, gallery, image, avatar, ...params } = data
        data = createFormData(params, file, files, gallery, image, avatar)
        console.log({ data })
    } else data = convertData(data)
    return clientApi.post(url, data, isUpload ? { timeout, headers: { 'Content-Type': 'multipart/form-data' } } : { timeout })
};

export const getData = (url:any, params:any) => {
    const project=  localStorage.getItem('project')
    if(project){
        const _project = JSON.parse(project);
        params = {projectId:_project.projectId,...params}
    }
    params = convertData(params)
    return clientApi.get(url, { params })
};

export const postDataV3 = (url:any, data:any, isUpload = false, timeout = 600000) => {
    if (isUpload) {
        const { file, ...params } = data
        data = createFormData(params, file,)
        console.log({ data })
    } else data = convertData(data)
    return clientApi.post(url, data, isUpload ? { timeout, responseType: 'blob', headers: { 'Content-Type': 'multipart/form-data' } } : { timeout })
};

export const getDataV3 = (url:any, params:any, timeout = 600000) => {
    return clientApi.get(url + '?' + params, { timeout, responseType: 'blob', headers: { 'Content-Type': 'multipart/form-data' } })
};