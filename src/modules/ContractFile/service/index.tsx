import { useState, useEffect } from 'react';
import { listContractFile, listContractFileNotDispatch, listContractFileNotService, listSelectContractFile } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { setListFileContract, setListSelectFileContract } from 'redux/features/fileContract';

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
export const useListContractFileNotDispatch = ({ params, debounce = 500 }: any) => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listContractFileNotDispatch({ ...params });
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
export const useListContractFileNotService = ({ params, debounce = 500 }: any) => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listContractFileNotService({ ...params });
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
    const lists = useSelector((state: any) => state.fileContract.list);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const shouldFetch = !Array.isArray(lists) || lists.length === 0;

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listContractFile({...params});
            const arr = res?.data?.data?.data || [];
            dispatch(setListFileContract(arr)); // đẩy redux luôn
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
            setData(lists); // lấy redux
        }
    }, [shouldFetch, lists]); // thêm customers vào deps

    return { data, loading, error, refresh: fetchData };
};
export const useSelectContractFileWithState = (params : any)  => {
    const dispatch = useDispatch();
    const listSelects = useSelector((state: any) => state.fileContract.listSelect);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const shouldFetch = !Array.isArray(listSelects) || listSelects.length === 0;

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listContractFile({...params});
            const arr = res?.data?.data?.data || [];
            dispatch(setListSelectFileContract(arr)); // đẩy redux luôn
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
            setData(listSelects); // lấy redux
        }
    }, [shouldFetch, listSelects]); // thêm customers vào deps

    return { data, loading, error, refresh: fetchData };
};
