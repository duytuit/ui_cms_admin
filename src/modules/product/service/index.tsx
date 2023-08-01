import { useState, useEffect } from 'react';
import { listCampaign, countCampaign, detailCampaign } from '../api';

export const useListCampaign = (params:any) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listCampaign({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountCampaign = (params:any) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countCampaign({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailCampaign = (params:any) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailCampaign({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};