
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Column, DataTable, Panel } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { useDispatch } from "react-redux";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { Dropdown, Input } from "components/common/ListForm";
import { useListPartnerDetail } from "modules/partner/service";
import { listToast, refreshObject, VatDebit } from "utils";
import { addDebitMuaHangNCC, showDebit, ShowWithPurchaseNCCAsync, updateDebitMuaHangNCC } from "../api";
import { useListEmployeeWithState } from "modules/employee/service";
import { useListExpenseWithState } from "modules/categories/service";
import { useListVehicleWithState } from "modules/VehicleDispatch/service";
export default function UpdateMuaHang() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [productMuaHang, setProductMuaHang] = useState<any[]>([]);
  const [newMuaHang, setNewMuaHang] = useState<any>({vehicleId:0, amount: "", note: "",allocation:0,bill:"" });
  const [infos, setInfos] = useState<any>({accountingDate:Helper.toDayString()});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (productMuaHang.length === 0) {
      dispatch(showToast({ ...listToast[2], detail: "Chưa có chi tiết mua hàng" }));
      return;
    }
    infos.MuaHangNCC = productMuaHang; 
    let info = {
      ...infos,
     data:JSON.stringify(infos)
    };
    console.log(info);
    setLoading(true);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
   
     if (info.id) {
         const response = await updateDebitMuaHangNCC(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/debit/ListMuaHang");
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
       const response = await addDebitMuaHangNCC(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/debit/ListMuaHang");
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
  const { data: partnerDetails } = useListPartnerDetail({
    params: { status: 1 },
    debounce: 500,
  });
  const { data: partnerVenderDetails } = useListPartnerDetail({
    params: { status: 2 },
    debounce: 500,
  });
  const { data: employees } = useListEmployeeWithState({});
  const { data: vehicles } = useListVehicleWithState({});
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
  const employeeOptions = useMemo(() => {
    if (!Array.isArray(employees)) return [];
    return employees.map((x: any,index:number) => ({
      label: `${index+1}.${x.last_name ?? ""} ${x.first_name ?? ""}`.trim(),
      value: x.id,
    }));
  }, [employees]);
  const { data: DMExpense } = useListExpenseWithState({type:1,enable:1}); // danh mục chi phí
  const DMExpenseOptions = useMemo(() => {
      if (!Array.isArray(DMExpense)) return [];
      return DMExpense.filter((x: any) => x.parent_id === 12).map((x: any) => ({
        value: x.id,
        label:  x?.name ?? "(không tên)",
        parent_id: x.parent_id,
      }));
    }, [DMExpense]);
  const vehiclesOptions = useMemo(() => {
    if (!Array.isArray(vehicles)) return [];
    return vehicles.map((x: any) => ({
      label: `${x?.number_code ?? "(không tên)"}`,
      value: x.id,
    }));
  }, [vehicles]);
  useEffect(() => {
  if (!id || vehiclesOptions.length === 0) return;

  ShowWithPurchaseNCCAsync({ id })
    .then(res => {
      const detail = res?.data?.data;
      if (!detail) return;

      const receiptDetails = (detail.receipt?.receiptDetails ?? []).map((item: any) => ({
        ...item,
        vehicleName:
          vehiclesOptions.find(v => v.value === item.vehicleId)?.label ?? "",
      }));

      setProductMuaHang(receiptDetails);

      setInfos({
        ...detail,
        incomeExpenseCategoryId: detail.receipt?.incomeExpenseCategoryId ?? "",
        employeeId: detail.receipt?.employeeId,
      });
    })
    .catch(() => {
      // handle error nếu cần
    });
}, [id, vehiclesOptions]);
  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title="Mua hàng"
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/debit/ListMuaHang"
      >
        <div className="field">
          <Panel header="Thông tin">
            <div className="grid">
              <div className="col-12">
                <div className="formgrid grid">
                   <div className="field col-4">
                      <MyCalendar dateFormat="dd/mm/yy"
                        value={Helper.formatDMYLocal(infos.accountingDate ? infos.accountingDate : '')} // truyền nguyên ISO string
                        onChange={(e: any) =>
                        setInfos({ ...infos, accountingDate: e })}
                        className={classNames("w-full", "p-inputtext", "input-form-sm")} />
                    </div>
                  <div className="field col-4">
                     <Dropdown
                      filter
                      value={infos.supplierDetailId}
                      optionValue="value"
                      optionLabel="label"
                      options={partnerVenderOptions}
                      label="Nhà cung cấp"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, supplierDetailId: e.value })
                      }
                      disabled={id ? true : false}
                    />
                  </div>
                  <div className="field col-4">
                     <Dropdown
                      filter
                      showClear
                      value={infos.employeeId}
                      optionValue="value"
                      optionLabel="label"
                      options={employeeOptions}
                      label="Nhân viên"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, employeeId: e.value })
                      }
                    />
                  </div>
                  <div className="field col-6">
                     <Dropdown
                      filter
                      value={infos.incomeExpenseCategoryId}
                      optionValue="value"
                      optionLabel="label"
                      options={DMExpenseOptions}
                      label="Lý do chi"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, incomeExpenseCategoryId: e.value })
                      }
                    />
                  </div>
                  <div className="field col-6">
                    <InputForm className="w-full"
                      id="note"
                      value={infos.note}
                      onChange={(e: any) =>
                        setInfos({ ...infos, note: e.target.value })
                      }
                      label="Diễn giải"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </Panel>
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
                 <Dropdown
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
                      options={VatDebit}
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
           <div className="field mt-4">
            <InputForm
              className="w-64"
              id="total_thanhtien"
              value={Helper.formatCurrency((productMuaHang
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

