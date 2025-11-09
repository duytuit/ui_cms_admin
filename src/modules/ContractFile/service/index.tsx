import { useState, useEffect } from 'react';
import { listContractFile, listSelectContractFile } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { setEmployee } from 'redux/features/employee';
import { setFileContract } from 'redux/features/fileContract';

export const useListContractFile = ({ params, debounce = 500 }: any) => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listContractFile({ ...params });
            setData(res?.data?.data || []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!params || Object.keys(params).length === 0) {
            setData([]);
            return;
        }
        const timer = setTimeout(fetchData, debounce);
        return () => clearTimeout(timer);
    }, [JSON.stringify(params)]);

    return { data, loading, error, refresh: fetchData };
};

export const useListContractFileWithState = (params : any)  => {
    const dispatch = useDispatch();
    const fileContractInfo = useSelector((state: any) => state.fileContract.fileContractInfo);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const shouldFetch = !Array.isArray(fileContractInfo) || fileContractInfo.length === 0;

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listContractFile({...params});
            const arr = res?.data?.data?.data || [];
            dispatch(setFileContract(arr)); // đẩy redux luôn
            setData(arr);               // set local luôn
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (shouldFetch) {
            fetchData();
        } else {
            setData(fileContractInfo); // lấy redux
        }
    }, [shouldFetch, fileContractInfo]); // thêm customers vào deps

    return { data, loading, error, refresh: fetchData };
};
