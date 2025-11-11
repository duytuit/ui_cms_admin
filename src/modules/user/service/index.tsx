import { useState, useEffect } from 'react';
import { listUser } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { setListUser } from 'redux/features/user';

export const useListUsers = ({ params, debounce = 500 }: any) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listUser({ ...params });
            console.log(res?.data?.data);
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

export const useListUserWithState = (params : any)  => {
    const dispatch = useDispatch();
    const lists = useSelector((state: any) => state.user.list);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const shouldFetch = !Array.isArray(lists) || lists.length === 0;

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listUser({...params});
            const arr = res?.data?.data?.data || [];
            dispatch(setListUser(arr)); // đẩy redux luôn
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
    }, []); // thêm customers vào deps

    return { data, loading, error, refresh: fetchData };
};
