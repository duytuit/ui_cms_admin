import { useState, useEffect } from 'react';
import { listCustomer } from '../api';

export const useListCustomer = (params:any) => {
    const [data, setData] = useState([]);
     function fetchData() {
         listCustomer({ status: 1, ...params }).then(
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
