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
export const transportation_cost = [
  { key: "DauDinhMuc", label: "Dầu định mức" },
  { key: "DauThucTe", label: "Dầu thực tế" },
  { key: "SoPhieu", label: "Số phiếu" },
  { key: "CayDau", label: "Cây dầu" },
  { key: "PhatSinh", label: "Phát sinh" },
  { key: "CaoToc", label: "Cao tốc" },
  { key: "LuongChuyen", label: "Lương chuyến" }
];
export const ChiPhiLaiXe = [
  { key: "meal_fee", label: "Tiền ăn" },
  { key: "ticket_fee", label: "Tiền vé" },
  { key: "overnight_fee", label: "Tiền ăn đêm" },
  { key: "penalty_fee", label: "Tiền luật" },
  { key: "goods_fee", label: "Lương hàng về" },
  { key: "delivery_point", label: "Điểm trả hàng" },
  { key: "PhatSinh", label: "Phát sinh" },
  { key: "CaoToc", label: "Cao tốc" },
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
export const typeVehicle = [
   {
     isExternalDriver:0,
     name:"Xe trong"
   },
    {
     isExternalDriver:1,
     name:"Xe ngoài"
   }
];
export const typeWork = [
   {
     value:0,
     label:"Công việc thường"
   },
    {
     value:1,
     label:"Lặp lại theo ngày"
   }
];
export const typeDebit = [
   {
     type:0,
     name:"Phí hải quan"
   },
   {
     type:1,
     name:"Phí vận chuyển"
   },
   {
     type:2,
     name:"Phí chi hộ"
   },
    {
     type:3,
     name:"Phí nâng hạ"
   },
    {
     type:4,
     name:"Phí khác"
   },
    {
     type:5,
     name:"Phí dịch vụ đầu kỳ KH"
   },
    {
     type:6,
     name:"Phí chi hộ đầu kỳ KH"
   },
    {
     type:7,
     name:"Mua hàng NCC"
   },
    {
     type:8,
     name:"Bán hàng KH"
   },
   {
     type:9,
     name:"Bán hàng NV"
   },
   {
     type:10,
     name:"Phí dịch vụ đầu kỳ NCC"
   },
   {
     type:11,
     name:"Phí chi hộ đầu kỳ NCC"
   },
   {
     type:12,
     name:"Phí khác NCC"
   }
];
export const TypeIncomeExpense = [
  { value: 1, label: "Thu hoàn ứng giao nhận" },
  { value: 2, label: "Thu hoàn ứng lái xe" },
  { value: 3, label: "Thu khác" },
  { value: 4, label: "Thu tạm ứng khách hàng" },
  { value: 5, label: "Thu cược" },
  { value: 6, label: "Thu tạm ứng" },
  { value: 7, label: "Bán hàng" },
  { value: 8, label: "Vay ngân hàng" },
  { value: 9, label: "Chi hoàn ứng giao nhận" },
  { value: 10, label: "Chi tạm ứng lái xe" },
  { value: 11, label: "Chi hộ khách hàng" },
  { value: 12, label: "Chi phí kinh doanh" },
  { value: 13, label: "Chi khác" },
  { value: 14, label: "Chi tạm ứng tiền cho nhà cung cấp" },
  { value: 15, label: "Chi tạm ứng giao nhận" },
  { value: 16, label: "Phí sửa chữa" },
  { value: 17, label: "Phí dầu DO" },
  { value: 18, label: "Cước đường bộ" },
  { value: 19, label: "Phí khác" },
  { value: 20, label: "Phí lãi vay" },
  { value: 21, label: "Trả lương nhân viên" },
  { value: 22, label: "Trích lương nhân viên" },
  { value: 23, label: "Chi hoàn ứng giao nhận" },
  { value: 24, label: "Thu khách hàng" },
  { value: 25, label: "Chi nhà cung cấp" },
  { value: 26, label: "Chi chuyển tiền nội bộ" },
  { value: 27, label: "Thu chuyển tiền nội bộ" },
  { value: 28, label: "Thu giao nhận" },
  { value: 29, label: "Thu lái xe" },
  { value: 30, label: "Thu hoàn trả phiếu tạm thu giao nhận" },
  { value: 31, label: "Thu đối trừ khách hàng" },
  { value: 32, label: "Chi đối trừ nhà cung cấp" },
  { value: 33, label: "Số dư tài khoản" },
  { value: 34, label: "Phí bảo hiểm xã hội" },
  { value: 35, label: "Phí gửi xe" },
  { value: 36, label: "Doanh thu khác" },
  { value: 37, label: "Trả bảo hiểm xã hội" },
  { value: 38, label: "Phí đi đường của lái xe" }
];
export const TypeDebitDKKH = [
   {
     value:5,
     name:"Phí dịch vụ"
   },
    {
     value:6,
     name:"Phí chi hộ"
   }
];
export const TypeDebitDKNCC = [
   {
     value:10,
     name:"Phí dịch vụ"
   },
    {
     value:11,
     name:"Phí chi hộ"
   }
];
export const statusDebit = [
   {
     status:0,
     name:"Chưa duyệt"
   },
    {
     status:1,
     name:"Đã duyệt"
   }
];
export const typeService = [
   {
     status:0,
     name:"Chi phí hải quan"
   },
    {
     status:1,
     name:"Chi phí chi hộ"
   }
];
export const typeDepreciation = [
   {
     type:1,
     name:"TSCD"
   },
    {
     type:2,
     name:"CPTT"
   },
   {
     type:3,
     name:"CPC"
   }
];
export const typeReceipt = [
   {
     typeReceipt:0,
     name:"Thu KH"
   },
    {
     typeReceipt:1,
     name:"Chi giao nhận"
   },
    {
     typeReceipt:2,
     name:"Chi hoàn ứng giao nhận"
   },
    {
     typeReceipt:3,
     name:"Thu hoàn ứng giao nhận"
   },
   {
     typeReceipt:7,
     name:"Chi NCC"
   },
   {
     typeReceipt:8,
     name:"Chi Nội Bộ"
   },
   {
     typeReceipt:10,
     name:"Chuyển tiền nội bộ"
   },
];
export const VatDebit = [
   {
     vat:0,
     name:"0"
   },
    {
     vat:5,
     name:"5"
   },
    {
     vat:8,
     name:"8"
   },
    {
     vat:10,
     name:"10"
   }
];
export const TypeDoiTuong = [
   {
     value:0,
     name:"Khách hàng"
   },
    {
     value:1,
     name:"Nhà cung cấp"
   },
   {
     value:2,
     name:"Nhân viên"
   }
];
export const formOfPayment = [
    {
     value:1,
     name:"Tiền mặt"
   },
    {
     value:2,
     name:"Chuyển khoản"
   }
];
// const typeServiceMap: Record<number, string> = {
//   0: "Chi phí hải quan",
//   1: "Chi phí chi hộ"
// };
export const statusOptions = [
  { label: 'Đã duyệt', value: 1 },
  { label: 'Chưa duyệt', value: 0 }
];
export const statusServiceDebit = [
  { label: 'Chưa bàn giao', value: 0 },
  { label: 'Đã bàn giao phiếu', value: 1 },
  { label: 'Đã nhận phiếu', value: 2 },
  { label: 'Đã hoàn trả', value: 3 },
  { label: 'Đã hoàn tiền', value: 4 },
  { label: 'Đã hoàn cược', value: 5 }
];