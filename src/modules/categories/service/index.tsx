import { useState, useEffect } from 'react';
import { listCategories } from '../api';

export const useListCategories = (params?:any) => {
    const [data, setData] = useState([]);
     function fetchData() {
         listCategories({ status: 1, ...params }).then(
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
