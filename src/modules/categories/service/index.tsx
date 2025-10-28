import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIncomeExpense, setServiceCategory, setServiceCategoryChiHo } from 'redux/features/category';
import { listIncomeExpense, listServiceCategory } from '../api';

export const useListServiceCategory = ({ params, debounce = 500 }: any) => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listServiceCategory({ ...params });
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
export const useListServiceCategoryWithState = (params : any)  => {
    const dispatch = useDispatch();
    const ServiceCategorys =  useSelector((state: any) => params.type === 1? state.category.ServiceCategoryChiHo : state.category.ServiceCategory);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const shouldFetch = !Array.isArray(ServiceCategorys) || ServiceCategorys.length === 0;

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listServiceCategory({...params});
            const arr = res?.data?.data?.data || [];
             dispatch(params.type === 1? setServiceCategoryChiHo(arr) :setServiceCategory(arr)); // đẩy redux luôn
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
            setData(ServiceCategorys); // lấy redux
        }
    }, [shouldFetch, ServiceCategorys]); // thêm customers vào deps

    return { data, loading, error, refresh: fetchData };
};
export const useListIncomeExpense = ({ params, debounce = 500 }: any) => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listIncomeExpense({ ...params });
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
export const useListIncomeExpenseWithState = (params : any)  => {
    const dispatch = useDispatch();
    const IncomeExpenses = useSelector((state: any) => state.category.IncomeExpense);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const shouldFetch = !Array.isArray(IncomeExpenses) || IncomeExpenses.length === 0;

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listIncomeExpense({...params});
            const arr = res?.data?.data?.data || [];
            dispatch(setIncomeExpense(arr)); // đẩy redux luôn
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
            setData(IncomeExpenses); // lấy redux
        }
    }, [shouldFetch, IncomeExpenses]); // thêm customers vào deps

    return { data, loading, error, refresh: fetchData };
};
