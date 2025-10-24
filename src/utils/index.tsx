import { useState, useEffect } from 'react';
import { getData } from '../lib/request';

export const removeNullObj = (arr:any) => {
    return arr.filter((element:any) => element !== null);
}

// export const formatTreeSelect = (array:any) => {
//     let newObject = [];
//     array.forEach((a:any, index:any) => {
//         newObject[a] = { checked: true, partialChecked: true, sort: index };
//     });
//     return newObject;
// }

export const getArrIdFromTreeSelect = (object:any) => {
    let arr = [];
    let newArr = [];
    for (let key in object) {
        if (!key.includes('-')) {
            if (object[key] && (object[key].sort === 0 || object[key].sort)) {
                arr[Number(object[key].sort)] = Number(key);
            } else newArr.push(Number(key));
        };
    };
    return arr.concat(newArr);
};
export const refreshObject = (object:any) => {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            if (typeof object[key] === 'string') object[key] = '';
            else object[key] = undefined;
        };
    };
    return object;
};

export const useListCity = () => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getData("web/address/getListCities",null);
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, []);
    return data;
};

export const useListDistrict = (province_id:number) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getData("web/address/getListDistricts", { province_id: province_id });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [province_id]);
    return data;
};

export const useListWard = (district_id:any) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getData("web/address/getListWard", { district_id: district_id });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [district_id]);
    return data;
};

export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

export const listToast = [
    { severity: 'success', summary: 'Successful' },
    { severity: 'error', summary: 'Error' },
    { severity: 'warn', summary: 'Warning' },
    { severity: 'info', summary: 'Info' },
];
export const tinhChat = [
   {
       feature:0,
       name:"Hàng nhập"
   },
    {
        feature:1,
        name:"Hàng Xuất"
   }
];
export const loaiHang = [
   {
     type:0,
     name:"Hàng lẻ"
   },
    {
     type:1,
     name:"Hàng cont"
   }
];
export const loaiToKhai = [
   {
     DeclarationType:0,
     name:"Luồng xanh"
   },
    {
     DeclarationType:1,
     name:"Luồng vàng"
   },
   {
     DeclarationType:2,
     name:"Luồng đỏ"
   }
];
export const phatSinh = [
   {
     occurrence:0,
     name:"Không"
   },
    {
     occurrence:1,
     name:"Nhiều tờ khai"
   }
];
export const nghiepVu = [
   {
     business:0,
     name:"Thông quan"
   },
    {
     business:1,
     name:"Đổi lệnh dưới kho"
   },
   {
     business:2,
     name:"Rút ruột"
   },
   {
     business:3,
     name:"Thông quan kèm kiểm định/KTCL"
   },
   {
     business:4,
     name:"Không có trucking"
   }
];