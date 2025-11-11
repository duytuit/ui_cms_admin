import { useState, useEffect } from 'react';
import { listPartner, listPartnerDetail } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomer, setListPartner } from 'redux/features/partner';

export const useListPartner = ({ params, debounce = 500 }: any) => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listPartner({ ...params });
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
export const useListPartnerDetail = ({ params, debounce = 500 }: any) => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listPartnerDetail({ ...params });
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
export const useListCustomerDetailWithState = (params : any)  => {
    const dispatch = useDispatch();
    const customers = useSelector((state: any) => state.partner.customer);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const shouldFetch = !Array.isArray(customers) || customers.length === 0;

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listPartnerDetail({...params});
            const arr = res?.data?.data?.data || [];
            dispatch(setCustomer(arr)); // đẩy redux luôn
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
            setData(customers); // lấy redux
        }
    }, []); // thêm customers vào deps

    return { data, loading, error, refresh: fetchData };
};

export const useListPartnerDetailWithState = (params : any)  => {
    const dispatch = useDispatch();
    const lists = useSelector((state: any) => state.partner.list);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const shouldFetch = !Array.isArray(lists) || lists.length === 0;

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listPartnerDetail({...params});
            const arr = res?.data?.data?.data || [];
            dispatch(setListPartner(arr)); // đẩy redux luôn
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

