import { useState, useEffect } from 'react';
import { getData } from '../lib/request';

export const removeNullObj = (arr:any) => {
    return arr.filter((element:any) => element !== null);
}



export const getArrIdFromTreeSelect = (object:any) => {
    let arr = [];
    let newArr = [];
    for (let key in object) {
        if (!key.includes('-')) {
            if (object[key] && (object[key].sort === 0 || object[key].sort)) {
                arr[Number(object[key].sort)] = Number(key);
            } else newArr.push(Number(key));
        };
    };
    return arr.concat(newArr);
};


export const useListCity = () => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getData("web/address/getListCities",null);
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, []);
    return data;
};

export const useListDistrict = (province_id:number) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getData("web/address/getListDistricts", { province_id: province_id });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [province_id]);
    return data;
};

export const useListWard = (district_id:any) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getData("web/address/getListWard", { district_id: district_id });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [district_id]);
    return data;
};

export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

export const listToast = [
    { severity: 'success', summary: 'Successful' },
    { severity: 'error', summary: 'Error' },
    { severity: 'warn', summary: 'Warning' },
    { severity: 'info', summary: 'Info' },
];