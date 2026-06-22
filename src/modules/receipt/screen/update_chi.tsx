
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Column, DataTable, Panel, RadioButton } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { formOfPayment, listToast, refreshObject, TypeDoiTuong, VatDebit } from "utils";
import { showReceipt, addReceiptChiNoiBo, updateReceiptChiNoiBo } from "../api";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { Dropdown, Input } from "components/common/ListForm";
import { useListEmployeeWithState } from "modules/employee/service";
import { useListPartnerDetail } from "modules/partner/service";
import { useListBankWithState, useListFundCategoryWithState, useListExpenseWithState } from "modules/categories/service";
import { DropDownTree } from "components/common/DropDownTree";
import { useListVehicleWithState } from "modules/VehicleDispatch/service";
export default function UpdateReceiptChi() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState<any>({});
  const [bankSelect, setBankSelect] = useState<any>({});
  const [doiTuongOptions, setDoiTuongOptions] = useState<any>([]);
  const [listProduct, setListProduct] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState<any>({vehicleId:0, amount: "", note: "",allocation:0,bill:"" });
  const [infos, setInfos] = useState<any>({vat:0,object:0,objectId:0,accountingDate:Helper.toDayString(),formOfPayment:1 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    infos.typeReceipt = 8
    infos.prefixCode = "PC"
    infos.listProduct = listProduct
    let info = {
      ...infos, 
      // amount: parseInt(infos.amount.replace(/\D/g, ""), 10),
      // thanhtien: parseInt(infos.thanhtien.replace(/\D/g, ""), 10), 
      status: infos.status ? 0 : 1,
     data:JSON.stringify(infos)
    };
    console.log(infos);
    setLoading(true);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
   
     if (info.id) {
         const response = await updateReceiptChiNoiBo(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/receipt/ListReceiptChi");
         } else {
           dispatch(
             showToast({ ...listToast[2], detail: response.data.message })
           );
         }
       } else
         dispatch(
           showToast({ ...listToast[1], detail: response.data.message })
         );
     } else {
       const response = await addReceiptChiNoiBo(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/receipt/ListReceiptChi");
         } else {
           dispatch(
             showToast({ ...listToast[2], detail: response.data.message })
           );
         }
       } else
         dispatch(
           showToast({ ...listToast[1], detail: response.data.message })
         );
     }
  };
   const { data: vehicles } = useListVehicleWithState({});
   const vehiclesOptions = useMemo(() => {
    if (!Array.isArray(vehicles)) return [];
    return vehicles.map((x: any) => ({
      label: `${x?.number_code ?? "(không tên)"}`,
      value: x.id,
    }));
  }, [vehicles]);
   const { data: DMQuy } = useListFundCategoryWithState({type:1});
   const DMQuyOptions = useMemo(() => {
       if (!Array.isArray(DMQuy)) return [];
       return DMQuy.map((x: any) => ({
         label: x?.fund_name ?? "(không tên)",
         value: x.id,
       }));
     }, [DMQuy]);
   const { data: DMExpense } = useListExpenseWithState({type:1,enable:1}); // danh mục chi phí
   const DMExpenseOptions = useMemo(() => {
       if (!Array.isArray(DMExpense)) return [];
       return DMExpense.map((x: any) => ({
         id: x.id,
         name:  x?.name ?? "(không tên)",
         parent_id: x.parent_id,
       }));
     }, [DMExpense]);
   const { data: DMBank } = useListBankWithState({type:1});
   const DMBankOptions = useMemo(() => {
       if (!Array.isArray(DMBank)) return [];
       return DMBank.map((x: any) => ({
         label: `${x.account_number} - ${x.account_holder}`,
         value: x.id,
       }));
     }, [DMBank]);
   const { data: employees } = useListEmployeeWithState({
     params: { keyword: "abc" },
     debounce: 500,
   });
     const employeeOptions = useMemo(() => {
    if (!Array.isArray(employees)) return [];
    return employees.map((x: any,index:number) => ({
      label: `${index+1}.${x.last_name ?? ""} ${x.first_name ?? ""}`.trim(),
      value: x.id,
    }));
  }, [employees]);
     const { data: partnerDetails } = useListPartnerDetail({
     params: { status: 1 },
     debounce: 500,
   });
   const { data: partnerVenderDetails } = useListPartnerDetail({
     params: { status: 2 },
     debounce: 500,
   });

    const partnerOptions = useMemo(() => {
      if (!Array.isArray(partnerDetails?.data)) return [];
      return partnerDetails.data.map((x: any) => ({
        label: x?.partners?.abbreviation ?? "(không tên)",
        value: x.id,
      }));
    }, [partnerDetails]);
    
    const partnerVenderOptions = useMemo(() => {
      if (!Array.isArray(partnerVenderDetails?.data)) return [];
      return partnerVenderDetails.data.map((x: any) => ({
        label: x?.partners?.abbreviation ?? "(không tên)",
        value: x.id,
      }));
    }, [partnerVenderDetails]);
  function GetBank(id:Number){
     const selected = DMBank.find((x: any) => x.id === id);
     setBankSelect(selected || {});
  }
  useEffect(() => {
      const employeeInfo = localStorage.getItem('employeeInfo') ? JSON.parse(localStorage.getItem('employeeInfo') || '{}') : null;
      setEmployeeInfo(employeeInfo);
       if (!id) {
        setDoiTuongOptions(partnerOptions);
        return;
      }

      if (
        !partnerOptions.length ||
        !partnerVenderOptions.length ||
        !employeeOptions.length ||
        !employees?.length ||
        !DMBank?.length
      ) return;
        showReceipt({ id: id, type: CategoryEnum.country }).then(res => {
          const detail = res.data.data
          if (detail) {
            GetBank(detail.bankId)
            const _nguoitao = employees.find((x: any) => x.user_id === detail.updatedBy);
            setEmployeeInfo(_nguoitao);
            setListProduct(detail.receiptDetails || []);
             if(detail.object === 0){
                setDoiTuongOptions(partnerOptions)
              }else if(detail.object === 1){
                setDoiTuongOptions(partnerVenderOptions)
              }else{
                setDoiTuongOptions(employeeOptions)
              }
            let info = {
              ...detail, status: detail.status === 0 ? true : false,
            };
            setInfos(info)
            
          }
        }).catch(err => {
          //setHasError(true)
        });
      
    }, [ id,
        partnerOptions,
        partnerVenderOptions,
        employeeOptions,
        employees,
        DMBank])
  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title="phiếu chi"
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/receipt/ListReceiptChi"
        route={Number(id) ? "/receipt/update" : "/receipt/create"}
      >
        <div className="field">
          <Panel header="Thông tin">
            <div className="grid">
              <div className="col-8">
                <div className="formgrid grid">
                  <div className="field col-6">
                    <MyCalendar dateFormat="dd/mm/yy"
                      value={Helper.formatDMYLocal(infos.accountingDate ? infos.accountingDate : '')} // truyền nguyên ISO string
                      onChange={(e: any) =>
                      setInfos({ ...infos, accountingDate: e })}
                      className={classNames("w-full", "p-inputtext", "input-form-sm")} />
                  </div>
                 <div className="field col-6">
                    <label htmlFor="">Hình thức thanh toán</label>
                    <div className="flex flex-wrap gap-3">
                      {formOfPayment.map((item) => (
                        <div key={item.value} className="flex align-items-center">
                          <RadioButton
                            inputId={`payment_${item.value}`}
                            name="formOfPayment"
                            value={item.value}
                            onChange={(e: any) => setInfos({ ...infos, formOfPayment: e.value })}
                            checked={infos.formOfPayment == item.value}
                          />
                          <label htmlFor={`payment_${item.value}`} className="ml-2">
                            {item.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                    <div className="field col-6">
                    <Dropdown
                      value={infos.object}
                      optionValue="value"
                      optionLabel="name"
                      options={TypeDoiTuong}
                      label="Đối tượng"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        {
                          const v = e.value;
                          // reset dependent selected id when type changes
                          setInfos({ ...infos, object: v})
                          if(v === 0){
                            setDoiTuongOptions(partnerOptions)
                          }else if(v === 1){
                            setDoiTuongOptions(partnerVenderOptions)
                          }else{
                            setDoiTuongOptions(employeeOptions)
                          }
                        }
                      }
                      required
                    />
                  </div>
                  <div className="field col-6">
                     <Dropdown
                      filter
                      value={infos.objectId}
                      optionValue="value"
                      optionLabel="label"
                      options={doiTuongOptions}
                      label="Đối tượng"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, objectId: e.value })
                      }
                      required
                    />
                  </div>
                  <div className="field col-12">
                    <Input
                      id="sales"
                      value={employeeInfo ? `${employeeInfo.last_name ?? ''} ${employeeInfo.first_name ?? ''}`.trim() : ''}
                      onChange={(e: any) =>
                        setInfos({ ...infos, sales: e.target.value })
                      }
                      className="w-full"
                      label="Người tạo phiếu"
                      disabled
                    />
                  </div>
                  <div className="field col-12">
                     <DropDownTree
                      value={infos.incomeExpenseCategoryId}
                      data={DMExpenseOptions}
                      label="Lý do chi"
                      disableParent={false}
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, incomeExpenseCategoryId: e.value })
                      }
                      required
                    />
                  </div>
                   {/* <div className="field col-4">
                    <InputForm className="w-full"
                      id="Amount"
                      value={infos.amount}
                      onChange={(e: any) =>
                         {
                            const amount = parseInt(e.target.value.replace(/\D/g, "") || "0", 10);
                            const vat = parseInt(infos.vat || 0, 10);
                            const thanhtien = parseInt((amount + (amount * vat) / 100).toString());
                           setInfos({ ...infos, amount: Helper.formatCurrency(e.target.value ), thanhtien : Helper.formatCurrency(thanhtien.toString()) })
                         }
                      }
                      label="Số tiền"
                      required
                    />
                  </div>
                   <div className="field col-4">
                   <Dropdown
                      value={infos.vat}
                      optionValue="vat"
                      optionLabel="name"
                      options={VatDebit}
                      label="VAT"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                          {
                              const amount = parseInt(infos.amount.replace(/\D/g, "") || "0", 10);
                              const vat = parseInt(e.value || 0, 10);
                              const thanhtien = parseInt((amount + (amount * vat) / 100).toString());
                             setInfos({ ...infos, vat: e.value, thanhtien : Helper.formatCurrency(thanhtien.toString()) })
                          }
                      }
                      required
                    />
                  </div>
                   <div className="field col-4">
                    <InputForm className="w-full"
                      id="thanhtien"
                      value={infos.thanhtien}
                      label="Thành tiền"
                      disabled
                    />
                  </div>
                   <div className="field col-12">
                    <InputForm className="w-full"
                      id="bill"
                      value={infos.bill}
                      onChange={(e: any) =>
                        setInfos({ ...infos, bill: e.target.value })
                      }
                      label="Số hóa đơn"
                    />
                  </div> */}
                   <div className="field col-12">
                    <InputForm className="w-full"
                      id="note"
                      value={infos.note}
                      onChange={(e: any) =>
                        setInfos({ ...infos, note: e.target.value })
                      }
                      label="Diễn giải"
                    />
                  </div>
                </div>
              </div>
              <div className="col-4">
                 { infos.formOfPayment == 2 && <div className="formgrid grid">
                    <div className="col-12">
                      <Dropdown
                      value={infos.bankId}
                      optionValue="value"
                      optionLabel="label"
                      options={DMBankOptions}
                      label="Tài khoản ngân hàng"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        {
                          setInfos({ ...infos, bankId: e.value })
                          GetBank(e.value)
                        }
                      }
                    />
                    </div>
                    <div className="col-12">
                        <div className="mt-4"><b>Số tài khoản:</b>{bankSelect.account_number}</div>
                        <div className="mt-4"><b>Chủ tài khoản:</b>{bankSelect.bank_name}</div>
                        <div className="mt-4"><b>Chi nhánh:</b>{bankSelect.branch_name}</div>
                    </div>
                 </div>}
                  { infos.formOfPayment == 1 &&<div className="formgrid grid">
                    <div className="field col-12">
                        <Dropdown
                          value={infos.fundId}
                          optionValue="value"
                          optionLabel="label"
                          options={DMQuyOptions}
                          label="Loại quỹ"
                          className="w-full p-inputtext-sm"
                          onChange={(e: any) =>
                            setInfos({ ...infos, fundId: e.value })
                          }
                        />
                     </div>
                 </div>}
              </div>
            </div>
          </Panel>
           <Panel header="Chi tiết phiếu chi">
            <div className="formgrid grid">
              <div className="field col-3">
                <InputForm
                  className="w-full"
                  id="note"
                  value={newProduct.note}
                  onChange={(e: any) =>
                    setNewProduct({ ...newProduct, note: e.target.value })
                  }
                  label="Diễn giải"
                />
              </div>
               <div className="field col-3">
                <InputForm
                  className="w-full"
                  id="amount"
                  value={newProduct.amount}
                  onChange={(e: any) =>
                    setNewProduct({
                      ...newProduct,
                      amount: Helper.formatCurrency(e.target.value),
                    })
                  }
                  label="Số tiền"
                />
              </div>
              <div className="field col-3">
                 <Dropdown
                    filter
                    showClear
                    value={newProduct.vehicleId}
                    optionValue="value"
                    optionLabel="label"
                    options={vehiclesOptions}
                    label="Tên xe"
                    className="w-full p-inputtext-sm"
                    onChange={(e: any) =>
                       {
                          const selected = e.value; // Đây là value (ví dụ: 123)
                          const option = vehiclesOptions.find((x: any) => x.value === selected);
                            setNewProduct({ ...newProduct, vehicleId: selected, vehicle_info: {
                            id: selected,
                            name: option ? option.label : ''
                          } })  
                        }
                    }
                  />
              </div>
              <div className="field col-3">
                <Button
                  type="button"
                  className="w-full p-button-normal"
                  label="Thêm"
                  severity="success"
                  raised
                  onClick={() => {
                    if (!newProduct.note || !newProduct.amount)
                      return dispatch(showToast({ ...listToast[2], detail: "Nhập đủ thông tin mua hàng" }));

                    // convert price về số khi push
                    const numericPrice = parseInt(newProduct.amount.replace(/\D/g, ""), 10);

                    setListProduct([
                      ...listProduct,
                      { ...newProduct, amount: numericPrice,note:newProduct.note,vehicleId:newProduct.vehicleId,vehicleName:newProduct.vehicle_info?.name || "" },
                    ]);

                    // reset input
                    setNewProduct({vehicleId:0, note: "", amount: "",allocation:0,bill:""});
                  }}
                />
              </div>
            </div>

            <div className="child-table">
              <DataTable rowHover value={listProduct}>
                <Column field="note" header="Diễn giải" />
                <Column
                  field="amount"
                  header="Số tiền"
                  body={(row: any) => {
                   return ( <Input
                      className="w-full input-sm"
                      value={Helper.formatCurrency((row.amount || 0).toString())}
                      onChange={(e: any) => {
                        const updated = [...listProduct];
                        const rowData = { ...updated.find((item) => item === row) };
                        // ✅ Chuyển price về số nguyên, loại bỏ ký tự không phải số
                        const rawPrice =
                          typeof e.target.value === "string"
                            ? parseInt(e.target.value.replace(/\D/g, ""), 10) || 0
                            : Number(e.target.value) || 0;
                        rowData.amount = rawPrice;
                          // ✅ Tính thành tiền mới nếu có VAT
                        const vat = Number(rowData.vat) || 0;
                        rowData.thanhTien = Math.round(rawPrice * (1 + vat / 100));
                        const index = updated.findIndex((item) => item === row);
                        updated[index] = rowData;
                        setListProduct(updated);
                      }}
                    />
                    );
                  }}
                  footer={Helper.formatCurrency(
                    listProduct
                      .reduce((sum, item) => sum + (item.amount || 0), 0)
                      .toString()
                  )}
                  footerStyle={{ fontWeight: "bold" }}
                />
                 <Column
                  header="VAT"
                  body={(_: any, opt: any) => (
                    <Dropdown
                      value={listProduct[opt.rowIndex].vat || 0}
                      options={VatDebit}
                      optionValue="vat"
                      optionLabel="name"
                      className="p-inputtext-sm p-dropdown-sm"
                      onChange={(e: any) => {
                        const vatValue = Number(e.value) || 0;
                        const updated = [...listProduct];
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
                        setListProduct(updated);
                      }}
                      required
                    />
                  )}
                />

               <Column
                  field="thanhTien"
                  header="Thành tiền"
                  body={(_: any, opt: any) => {
                    const row = listProduct[opt.rowIndex];
                    // Chuyển amount về số thực, giữ decimal
                    const amount = typeof row.amount === "string"
                      ? parseFloat(row.amount.replace(/[^0-9.]/g, "")) || 0
                      : Number(row.amount) || 0;
                    const vat = Number(row.vat) || 0;
                    // Tính thành tiền
                    const thanhTien = Math.round(amount * (1 + vat / 100));
                    // ✅ Cập nhật luôn vào state
                    if (row.thanhTien !== thanhTien) {
                      const updated = [...listProduct];
                      updated[opt.rowIndex] = { ...row, thanhTien };
                      setListProduct(updated);
                    }
                    return Helper.formatCurrency(thanhTien.toString());
                  }}
                  footer={Helper.formatCurrency(
                    listProduct
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
                      value={listProduct[opt.rowIndex].bill || ""}
                      onChange={(e: any) => {
                        const updated = [...listProduct];
                        updated[opt.rowIndex] = {
                          ...updated[opt.rowIndex],
                          bill: e.target.value,
                        };
                        setListProduct(updated);
                      }}
                    />
                  )}
                />
                <Column field="vehicleName" header="Tên xe" />
                <Column field="allocation" header="Là chi phí phân bổ" 
                  body={(row: any) => {
                    return(
                      <Checkbox
                        className="p-checkbox-sm"
                        checked={row.allocation === 1}
                        onChange={(e: any) => {
                          const updated = [...listProduct];
                          const rowData = { ...updated.find((item) => item === row) };
                          rowData.allocation = e.checked ? 1 : 0;
                          const index = updated.findIndex((item) => item === row);
                          updated[index] = rowData;
                          setListProduct(updated);
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
                        setListProduct(listProduct.filter((_, i) => i !== opt.rowIndex))
                      }
                    />
                  )}
                />
              </DataTable>
            </div>
          </Panel>
           <div className="field mt-4">
            <InputForm
              className="w-64"
              id="total_thanhtien"
              value={Helper.formatCurrency((listProduct
                .reduce((sum, item) => {
                  const thanhTien = typeof item.thanhTien === "string"
                    ? parseFloat(item.thanhTien.replace(/[^0-9.]/g, "")) || 0
                    : Number(item.thanhTien) || 0;
                  return Math.round(sum + thanhTien);
                }, 0))
                .toString()
              )}
              label="Tổng cộng"
              readOnly // ✅ làm input chỉ đọc
            />
          </div>
        </div>
      </AddForm>
    </>
  );
}

