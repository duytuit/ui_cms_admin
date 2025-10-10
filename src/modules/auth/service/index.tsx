import { useState, useEffect } from "react";
import { getCaptCha } from "../api";

export const useGetCaptcha = (params?:any) => {
    const [data, setData] = useState({img:'',uuid:''});
    async function fetchData() {
        const response = await getCaptCha(params);
        if (response.data.code === 200) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return {
        data, setData
    };
};

export async function fetchGetCaptcha(params?:any) {
    const response = await getCaptCha(params);
    if (response.data.code === 200) return response.data.data;
};