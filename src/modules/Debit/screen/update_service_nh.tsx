
import { AddForm, InputForm } from "components/common/AddForm";
import { useEffect, useMemo, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, loaiToKhai, refreshObject, typeDebit } from "utils";
import { CategoryEnum } from "utils/type.enum";
import { addDebitNangha } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, MultiSelect } from "components/common/ListForm";
import { Column, DataTable, Panel } from "components/uiCore";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { showContractFile } from "modules/ContractFile/api";
import { useListPartnerDetail, useListSupplierDetailWithState } from "modules/partner/service";
import { useListServiceCategoryWithState } from "modules/categories/service";
export default function UpdateDebitNangHa({ id, onClose ,price }: { id: any; onClose: () => void, price:number }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({});
  const [productNangHa, setProductNangHa] = useState<any[]>([]);
  const [newNangHa, setNewNangHa] = useState<any>({ serviceId:"", name: "", purchasePrice: "", note: "", bill: "", linkBill: "", codeBill: "" ,SupplierDetailId:"",SupplierName:""});
  const { data: ChiHos } = useListServiceCategoryWithState({type:1});
    const ChiHoOptions = useMemo(() => {
    if (!Array.isArray(ChiHos)) return [];
    return ChiHos.map((x: any) => ({
      label: x?.name ?? "(không tên)",
      value: x.id,
    }));
  }, [ChiHos]);
  const { data: partnerDetails } = useListPartnerDetail({ params: { status: 1 }, debounce: 500 });
  const partnerOptions = useMemo(() => {
    if (!Array.isArray(partnerDetails?.data)) return [];
    return partnerDetails.data.map((x: any) => ({
      label: x?.partners?.abbreviation ?? "(không tên)",
      value: x.id,
    }));
  }, [partnerDetails]);
  const { data: supplierDetails } = useListSupplierDetailWithState({status: 2, debounce: 500 });
  const supplierOptions = useMemo(() => {
    if (!Array.isArray(supplierDetails)) return [];
    return supplierDetails.map((x: any) => ({
      label: x?.partners?.abbreviation ?? "(không tên)",
      value: x.id,
    }));
  }, [supplierDetails]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    infos.fileInfoId= infos.id;
    infos.productNangha= productNangHa;
    infos.status = infos.status ? 0 : 1;
    let info = {
      ...infos,
      data:JSON.stringify(infos)
    };
    console.log('info', info);
    setLoading(true);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
    if (info.id) {
       const response = await addDebitNangha(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          setInfos({ ...refreshObject(infos), status: true })
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          onClose();
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    }
  };

  useEffect(() => {
    if (!id) return;
    if (partnerOptions.length === 0) return;  // ✅ quan trọng
    if (id) {
      setLoading(true);
      const employeeInfo = localStorage.getItem('employeeInfo') ? JSON.parse(localStorage.getItem('employeeInfo') || '{}') : null;
      showContractFile({ id: id , type: CategoryEnum.country }).then(res => {
        const detail = res.data.data
        if (detail) {
          const _loaiToKhai = loaiToKhai.find( (x: any) => x.DeclarationType === detail.declarationType);
          const partner = partnerOptions.find((x:any)=>x.value == detail.customerDetailId)
           detail.partnerName = partner?.label
          if(detail.fileInfoDetails && employeeInfo){
             const EmployeeStaffInfo = detail.fileInfoDetails.find((x:any) => x.employeeId == employeeInfo.id);
             if(EmployeeStaffInfo){
                detail.employeeStaffId = employeeInfo.id;
                detail.confirm_price = EmployeeStaffInfo.price;
                detail.EmployeeStaffInfo = employeeInfo;
             }
            
          }
          let info = {
            ...detail, status: detail.status === 0 ? true : false,
             loaiToKhai:_loaiToKhai?.name
          };
          console.log('info',info);
          console.log('employeeInfo',employeeInfo);
          
          setInfos(info)
        }
      }).catch(err => {
        //setHasError(true)
      }).finally(() => setLoading(false));
    }
  }, [supplierOptions,id,partnerOptions.length,ChiHoOptions])
  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title="xe"
        loading={loading}
        onSubmit={handleSubmit}
        route={Number(id) ? "/debit/update" : "/debit/create"}
      >
        <div className="field">
          <Panel header="Thông tin bảng kê">
            <table className="w-full">
              <tbody>
                {/* --- HÀNG 1 --- */}
                <tr>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Khách hàng:</label>
                      <span>{infos.partnerName}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Số tờ khai:</label>
                      <span>{infos.declaration}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Số bill:</label>
                      <span>{infos.bill}</span>
                    </div>
                  </td>
                </tr>
                {/* --- HÀNG 2 --- */}
                <tr>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Số file:</label>
                      <span>{infos.fileNumber}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Số Cont:</label>
                      <span>{infos.containerCode}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                        <div><label className="font-medium">Nhân viên:</label> {`${infos?.EmployeeStaffInfo?.last_name ?? ""} ${infos?.EmployeeStaffInfo?.first_name ?? ""}`.trim()}</div>
                        <div><label className="font-medium">Được duyệt:</label> {price ? Helper.formatCurrency(price.toString()) : 0}</div>
                    </div>
                  </td>
                </tr>
                {/* --- HÀNG 3 --- */}
                <tr>
                  <td className="pr-4">
                    <label className="font-medium mr-2">Số Lượng:</label>
                    <span>{infos.quantity}</span>
                  </td>
                  <td className="pr-4">
                    <label className="font-medium mr-2">Loại tờ khai:</label>
                    <span>{infos.loaiToKhai}</span>
                  </td>
                  <td className="pr-4">
                    <MyCalendar
                      value={infos.accountingDate ? Helper.formatDMYLocal(infos.accountingDate) : ""}
                      dateFormat="dd/mm/yy"
                      onChange={(e: any) => setInfos({ ...infos, accountingDate: e })}
                      className={classNames("w-full", "p-inputtext", "input-form-sm")}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </Panel>
          <Panel header="Chi phí nâng hạ">
            <div className="formgrid grid">
              <div className="field col-2">
                <Dropdown
                  filter
                  value={newNangHa.serviceId}
                  options={ChiHoOptions}
                  onChange={(e: any) =>
                     {
                        const selected = e.value; // Đây là value (ví dụ: 123)
                        const option = ChiHoOptions.find((x: any) => x.value === selected);
                         setNewNangHa({ ...newNangHa, serviceId: selected, nangha_info: {
                          id: selected,
                          name: option ? option.label : ''
                        } })  
                     }
                  }
                  label="Phí nâng hạ"
                  className="w-full"
                />
              </div>
              <div className="field col-2">
                <Dropdown
                  filter
                  value={newNangHa.SupplierDetailId}
                  options={supplierOptions}
                  onChange={(e: any) =>
                     {
                        const selected = e.value; // Đây là value (ví dụ: 123)
                        const option = supplierOptions.find((x: any) => x.value === selected);
                         setNewNangHa({ ...newNangHa, SupplierDetailId: selected, supplier_info: {
                          id: selected,
                          name: option ? option.label : ''
                        } })  
                     }
                  }
                  label="Nhà cung cấp"
                  className="w-full"
                />
              </div>
              <div className="field col-2">
                <InputForm
                  className="w-full"
                  id="purchasePrice"
                  value={newNangHa.purchasePrice}
                  onChange={(e: any) =>
                    setNewNangHa({
                      ...newNangHa,
                      purchasePrice: Helper.formatCurrency(e.target.value),
                    })
                  }
                  label="Số tiền"
                />
              </div>
              <div className="field col-2">
                <InputForm
                  className="w-full"
                  id="bill"
                  value={newNangHa.bill}
                  onChange={(e: any) =>
                    setNewNangHa({ ...newNangHa, bill: e.target.value })
                  }
                  label="Hóa đơn"
                />
              </div>
              <div className="field col-2">
                <InputForm
                  className="w-full"
                  id="note"
                  value={newNangHa.note}
                  onChange={(e: any) =>
                    setNewNangHa({ ...newNangHa, note: e.target.value })
                  }
                  label="Ghi chú"
                />
              </div>
              <div className="field col-2">
                <Button
                  type="button"
                  className="w-full p-button-normal"
                  label="Thêm"
                  severity="success"
                  raised
                  onClick={() => {
                    if (!newNangHa.serviceId || !newNangHa.purchasePrice || newNangHa.purchasePrice <= 0)
                      return dispatch(showToast({ ...listToast[2], detail: "Nhập đủ thông tin nâng hạ" }));

                    // convert price về số khi push
                    const numericPrice = parseInt(newNangHa.purchasePrice.replace(/\D/g, ""), 10);

                    setProductNangHa([
                      ...productNangHa,
                      { ...newNangHa, purchasePrice: numericPrice,name: newNangHa.nangha_info.name,serviceId:newNangHa.nangha_info.id,SupplierName: newNangHa?.supplier_info?.name,SupplierDetailId:newNangHa?.supplier_info?.id},
                    ]);

                    // reset input
                    setNewNangHa({serviceId:"", name: "", purchasePrice: "", note: "",SupplierDetailId:"",SupplierName:"",bill:"" });
                  }}
                />
              </div>
            </div>

            <div className="child-table">
              <DataTable rowHover value={productNangHa}>
                <Column field="name" header="Phí nâng hạ" />
                <Column field="SupplierName" header="Nhà cung cấp" />
                <Column
                      field="purchasePrice"
                      header="Số tiền"
                      body={(row: any) => Helper.formatCurrency(row.purchasePrice.toString())}
                      footer={Helper.formatCurrency(
                        productNangHa
                          .reduce((sum, item) => sum + (item.purchasePrice || 0), 0)
                          .toString()
                      )}
                      footerStyle={{ fontWeight: "bold" }}
                    />
                <Column field="bill" header="Hóa đơn" />
                <Column field="note" header="Ghi chú" />
                <Column
                  header="Thao tác"
                  body={(_: any, opt: any) => (
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      onClick={() =>
                        setProductNangHa(productNangHa.filter((_, i) => i !== opt.rowIndex))
                      }
                    />
                  )}
                />
              </DataTable>
            </div>
          </Panel>
          {/* thêm dòng tổng cộng nằm bên phải */}
          <div className="field mt-4">
            <InputForm
              className="w-64"
              id="total_price"
              value={Helper.formatCurrency((
                productNangHa.reduce((sum, item) => sum + (item.purchasePrice || 0), 0)
              ).toString())}
              onChange={(e: any) =>
              // không cho sửa tổng
              { }
              }
              label="Tổng cộng"
            />
          </div>
        </div>
      </AddForm>
    </>
  );
}
