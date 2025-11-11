import { useState, useEffect } from 'react';
import {  listVehicle } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { setListVehicle } from 'redux/features/vehicle';

export const useListVehicle = ({ params, debounce = 500 }: any) => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await listVehicle({ ...params });
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
export const useListVehicleWithState = ({ params, debounce = 500 }: any) => {
   const dispatch = useDispatch();
      const lists = useSelector((state: any) => state.vehicle?.list);
  
      const [data, setData] = useState<any>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<any>(null);
  
      const shouldFetch = !Array.isArray(lists) || lists.length === 0;
  
      const fetchData = async () => {
          try {
              setLoading(true);
              setError(null);
              const res = await listVehicle({...params});
              const arr = res?.data?.data?.data || [];
              dispatch(setListVehicle(arr)); // đẩy redux luôn
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
