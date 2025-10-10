import { useEffect, useState } from "react";
import { getBarData, getLineData, getPieData, getScope } from "../api";

export const useGetLineData = (params:any) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getLineData({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useGetBarData = (params:any) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getBarData({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useGetPieData = (params:any) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getPieData({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useGetScope = (params:any) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getScope({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

