import { useState, useEffect } from 'react';
import { listUser } from '../api';

export const useListUsers = (params?: any) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await listUser({ status: 1, ...params });
                setData(res.data.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [JSON.stringify(params)]); // nếu params thay đổi sẽ refetch

    return { data, loading, error };
};
