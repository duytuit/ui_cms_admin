import { useState, useEffect } from 'react';
import { listPost } from '../api';

export const useListPost = (params:any) => {
    const [data, setData] = useState([]);
     function fetchData() {
         listPost({ status: 1, ...params }).then(
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
