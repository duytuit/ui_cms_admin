import { useState, useEffect } from 'react';
import { listProduct } from '../api';

export const useListProduct = (params:any) => {
    const [data, setData] = useState([]);
     function fetchData() {
         listProduct({ status: 1, ...params }).then(
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
