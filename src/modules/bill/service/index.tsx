import { useState, useEffect } from 'react';
import { listBill } from '../api';

export const useListBill = (params:any) => {
    const [data, setData] = useState([]);
     function fetchData() {
         listBill({ status: 1, ...params }).then(
            res => {
                setData(res.data.data);
            }
        ).catch(err => {
            //setHasError(true)
        });
       
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};
