import { useState, useEffect } from 'react';
import { listReceipt } from '../api';

export const useListReceipt = (params:any) => {
    const [data, setData] = useState([]);
     function fetchData() {
         listReceipt({ status: 1, ...params }).then(
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
