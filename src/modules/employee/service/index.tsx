import { useState, useEffect } from 'react';
import { listEmployee } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { setEmployee } from 'redux/features/employee';

export const useListEmployee = ({ params, debounce = 500 }: any) => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listEmployee({ ...params });
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
export const useListEmployeeWithState = (params : any)  => {
    const dispatch = useDispatch();
    const employees = useSelector((state: any) => state.employee.employeeInfo);

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const shouldFetch = !Array.isArray(employees) || employees.length === 0;

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listEmployee({...params});
            const arr = res?.data?.data?.data || [];
            dispatch(setEmployee(arr)); // đẩy redux luôn
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
            setData(employees); // lấy redux
        }
    }, [shouldFetch, employees]); // thêm customers vào deps

    return { data, loading, error, refresh: fetchData };
};
