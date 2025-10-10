import { useState, useEffect } from 'react';
import { listService } from '../api';

export const useListService = (params:any) => {
    const [data, setData] = useState([]);
     function fetchData() {
         listService({ status: 1, ...params }).then(
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
