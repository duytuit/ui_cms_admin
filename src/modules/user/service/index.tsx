import { useState, useEffect } from 'react';
import { listUser } from '../api';

export const useListUsers = (params?:any) => {
    const [data, setData] = useState([]);
     function fetchData() {
         listUser({ status: 1, ...params }).then(
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
