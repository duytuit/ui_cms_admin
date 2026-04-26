
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { Button, Checkbox, Column, DataTable, Dropdown, Panel } from "components/uiCore";
import { addDepreciation, showDepreciation, updateDepreciation } from "../api";
import { Helper } from "utils/helper";
import { Input } from "components/common/ListForm";
export default function UpdateDepreciation() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [productMuaHang, setProductMuaHang] = useState<any[]>([]);
  const [newMuaHang, setNewMuaHang] = useState<any>({vehicleId:0, amount: "", note: "",allocation:0,bill:"" });
    const [infos, setInfos] = useState<any>({type:CategoryEnum.country,isExternalDriver:0});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = (e:any) => {
        e.preventDefault();
        let info = {
          ...infos, status: infos.status ? 0 : 1,
      };
      console.log('info',info);
      
      setLoading(true);
      fetchDataSubmit(info);
    };
     async function fetchDataSubmit(info:any) {
      if (info.id) {
          const response = await updateDepreciation(info);
          if (response) setLoading(false);
          if (response.status === 200) {
              if(response.data.status){
                dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                navigate('/depreciation/list');
              }else{
                dispatch(showToast({ ...listToast[2], detail: response.data.message }))
              }
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      } else {
          const response = await addDepreciation(info);
          if (response) setLoading(false);
          if (response.status === 200) {
              if(response.data.status){
                setInfos({ ...refreshObject(infos), status: true })
                dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                navigate('/depreciation/list');
              }else{
                dispatch(showToast({ ...listToast[2], detail: response.data.message }))
              }
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      }
  };
    useEffect(()=>{
       if(id){
          showDepreciation({id:id,type:CategoryEnum.country}).then(res=>{
              const detail = res.data.data
              if(detail){
                let info = {
                  ...detail, status: detail.status === 0 ? true : false,
                };
                setInfos(info)
              }
          }).catch(err => {
            //setHasError(true)
        });
       }
    },[])
    return (
      <>
        <AddForm
          className="w-full"
          style={{ margin: "0 auto" }}
          checkId={infos.id}
          title="tài sản"
          loading={loading}
          onSubmit={handleSubmit}
          routeList="/depreciation/list"
          route={Number(id) ? "/depreciation/update" : "/depreciation/create"}
        >
           <div className="field">
               <Panel header="Chi tiết mua hàng">
            <div className="formgrid grid">
              <div className="field col-3">
                <InputForm
                  className="w-full"
                  id="note"
                  value={newMuaHang.note}
                  onChange={(e: any) =>
                    setNewMuaHang({ ...newMuaHang, note: e.target.value })
                  }
                  label="Diễn giải"
                />
              </div>
               <div className="field col-3">
                <InputForm
                  className="w-full"
                  id="amount"
                  value={newMuaHang.amount}
                  onChange={(e: any) =>
                    setNewMuaHang({
                      ...newMuaHang,
                      amount: Helper.formatCurrency(e.target.value),
                    })
                  }
                  label="Số tiền"
                />
              </div>
              <div className="field col-3">
                 {/* <Dropdown
                    filter
                    showClear
                    value={newMuaHang.vehicleId}
                    optionValue="value"
                    optionLabel="label"
                    options={vehiclesOptions}
                    label="Tên xe công trình"
                    className="w-full p-inputtext-sm"
                    onChange={(e: any) =>
                       {
                          const selected = e.value; // Đây là value (ví dụ: 123)
                          const option = vehiclesOptions.find((x: any) => x.value === selected);
                            setNewMuaHang({ ...newMuaHang, vehicleId: selected, vehicle_info: {
                            id: selected,
                            name: option ? option.label : ''
                          } })  
                        }
                    }
                  /> */}
              </div>
              <div className="field col-3">
                <Button
                  type="button"
                  className="w-full p-button-normal"
                  label="Thêm"
                  severity="success"
                  raised
                  onClick={() => {
                    if (!newMuaHang.note || !newMuaHang.amount)
                      return dispatch(showToast({ ...listToast[2], detail: "Nhập đủ thông tin mua hàng" }));

                    // convert price về số khi push
                    const numericPrice = parseInt(newMuaHang.amount.replace(/\D/g, ""), 10);

                    setProductMuaHang([
                      ...productMuaHang,
                      { ...newMuaHang, amount: numericPrice,note:newMuaHang.note,vehicleId:newMuaHang.vehicleId,vehicleName:newMuaHang.vehicle_info?.name || "" },
                    ]);

                    // reset input
                    setNewMuaHang({vehicleId:0, note: "", amount: "",allocation:0,bill:""});
                  }}
                />
              </div>
            </div>

            <div className="child-table">
              <DataTable rowHover value={productMuaHang}>
                <Column field="note" header="Diễn giải" />
                <Column
                  field="amount"
                  header="Số tiền"
                  body={(row: any) => Helper.formatCurrency(row.amount.toString())}
                  footer={Helper.formatCurrency(
                    productMuaHang
                      .reduce((sum, item) => sum + (item.amount || 0), 0)
                      .toString()
                  )}
                  footerStyle={{ fontWeight: "bold" }}
                />
                 <Column
                  header="VAT"
                  body={(_: any, opt: any) => (
                    <Dropdown
                      value={productMuaHang[opt.rowIndex].vat || 0}
                      options={[]}
                      optionValue="vat"
                      optionLabel="name"
                      className="p-inputtext-sm p-dropdown-sm"
                      onChange={(e: any) => {
                        const vatValue = Number(e.value) || 0;
                        const updated = [...productMuaHang];
                        const row = { ...updated[opt.rowIndex] };
                        // ✅ Chuyển price về số nguyên, loại bỏ ký tự không phải số
                        const rawPrice =
                          typeof row.amount === "string"
                            ? parseInt(row.amount.replace(/\D/g, ""), 10) || 0
                            : Number(row.amount) || 0;
                        // ✅ Nếu có quantity thì nhân thêm, mặc định là 1
                        const qty = Number(row.quantity) || 1;
                        // ✅ Tính thành tiền (price * qty * (1 + vat/100))
                        const thanhTien = Math.round(rawPrice * qty * (1 + vatValue / 100));
                        updated[opt.rowIndex] = {
                          ...row,
                          vat: vatValue,
                          thanhTien: thanhTien
                        };
                        setProductMuaHang(updated);
                      }}
                      required
                    />
                  )}
                />

               <Column
                  field="thanhTien"
                  header="Thành tiền"
                  body={(_: any, opt: any) => {
                    const row = productMuaHang[opt.rowIndex];
                    // Chuyển amount về số thực, giữ decimal
                    const amount = typeof row.amount === "string"
                      ? parseFloat(row.amount.replace(/[^0-9.]/g, "")) || 0
                      : Number(row.amount) || 0;
                    const vat = Number(row.vat) || 0;
                    // Tính thành tiền
                    const thanhTien = Math.round(amount * (1 + vat / 100));
                    // ✅ Cập nhật luôn vào state
                    if (row.thanhTien !== thanhTien) {
                      const updated = [...productMuaHang];
                      updated[opt.rowIndex] = { ...row, thanhTien };
                      setProductMuaHang(updated);
                    }
                    return Helper.formatCurrency(thanhTien.toString());
                  }}
                  footer={Helper.formatCurrency(
                    productMuaHang
                      .reduce((sum, item) => {
                        const amount = typeof item.amount === "string"
                          ? parseFloat(item.amount.replace(/[^0-9.]/g, "")) || 0
                          : Number(item.amount) || 0;

                        const vat = Number(item.vat) || 0;
                        return Math.round(sum + amount * (1 + vat / 100));
                      }, 0)
                      .toString()
                  )}
                  footerStyle={{ fontWeight: "bold" }}
                />
                <Column field="bill" header="Số hóa đơn" 
                 body={(_: any, opt: any) => (
                    <Input
                      className="w-full input-sm"
                      value={productMuaHang[opt.rowIndex].bill || ""}
                      onChange={(e: any) => {
                        const updated = [...productMuaHang];
                        updated[opt.rowIndex] = {
                          ...updated[opt.rowIndex],
                          bill: e.target.value,
                        };
                        setProductMuaHang(updated);
                      }}
                    />
                  )}
                />
                <Column field="vehicleName" header="Tên xe công trình" />
                <Column field="allocation" header="Là chi phí phân bổ" 
                  body={(row: any) => {
                    return(
                      <Checkbox
                        className="p-checkbox-sm"
                        checked={row.allocation === 1}
                        onChange={(e: any) => {
                          const updated = [...productMuaHang];
                          const rowData = { ...updated.find((item) => item === row) };
                          rowData.allocation = e.checked ? 1 : 0;
                          const index = updated.findIndex((item) => item === row);
                          updated[index] = rowData;
                          setProductMuaHang(updated);
                        }}
                        onClick={(e: any) => e.stopPropagation()}
                      />
                    );
                  }}  
                />
                <Column
                  header="Thao tác"
                  body={(_: any, opt: any) => (
                    <Button
                      type='button'
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      onClick={() =>
                        setProductMuaHang(productMuaHang.filter((_, i) => i !== opt.rowIndex))
                      }
                    />
                  )}
                />
              </DataTable>
            </div>
          </Panel>
           </div>
        </AddForm>
      </>
    );
}
