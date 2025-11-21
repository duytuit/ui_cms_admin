import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBank, setExpense, setFundCategory, setIncome, setIncomeExpense, setServiceCategory, setServiceCategoryChiHo } from 'redux/features/category';
import { listBank, listFundCategory, listIncomeExpense, listServiceCategory } from '../api';

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
    }, []); // thêm customers vào deps

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
    }, []); // thêm customers vào deps

    return { data, loading, error, refresh: fetchData };
};
export const useListExpenseWithState = (params : any)  => {
    const dispatch = useDispatch();
    const Expenses = useSelector((state: any) => state.category.Expense);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const shouldFetch = !Array.isArray(Expenses) || Expenses.length === 0;

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listIncomeExpense({...params});
            const arr = res?.data?.data?.data || [];
            dispatch(setExpense(arr)); // đẩy redux luôn
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
            setData(Expenses); // lấy redux
        }
    }, []); // thêm customers vào deps

    return { data, loading, error, refresh: fetchData };
};
export const useListIncomeWithState = (params : any)  => {
    const dispatch = useDispatch();
    const Incomes = useSelector((state: any) => state.category.Income);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const shouldFetch = !Array.isArray(Incomes) || Incomes.length === 0;

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listIncomeExpense({...params});
            const arr = res?.data?.data?.data || [];
            dispatch(setIncome(arr)); // đẩy redux luôn
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
            setData(Incomes); // lấy redux
        }
    }, []); // thêm customers vào deps

    return { data, loading, error, refresh: fetchData };
};
export const useListBankWithState = (params : any)  => {
    const dispatch = useDispatch();
    const Bank = useSelector((state: any) => state.category.Bank);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const shouldFetch = !Array.isArray(Bank) || Bank.length === 0;

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listBank({...params});
            const arr = res?.data?.data?.data || [];
            dispatch(setBank(arr)); // đẩy redux luôn
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
            setData(Bank); // lấy redux
        }
    }, []); // thêm customers vào deps

    return { data, loading, error, refresh: fetchData };
};

export const useListFundCategoryWithState = (params : any)  => {
    const dispatch = useDispatch();
    const FundCategory = useSelector((state: any) => state.category.FundCategory);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const shouldFetch = !Array.isArray(FundCategory) || FundCategory.length === 0;

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listFundCategory({...params});
            const arr = res?.data?.data?.data || [];
            dispatch(setFundCategory(arr)); // đẩy redux luôn
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
            setData(FundCategory); // lấy redux
        }
    }, []); // thêm customers vào deps

    return { data, loading, error, refresh: fetchData };
};
