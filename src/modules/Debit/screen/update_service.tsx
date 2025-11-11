
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, loaiToKhai, refreshObject, typeDebit } from "utils";
import { useDispatch, useSelector } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { addDebit, addDebitService, showDebit, updateDebit } from "../api";
import { Dropdown, MultiSelect } from "components/common/ListForm";
import { Column, DataTable, Panel } from "components/uiCore";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import React from "react";
import { showContractFile } from "modules/ContractFile/api";
import { useListPartnerDetail } from "modules/partner/service";
import { useListIncomeExpenseWithState, useListServiceCategoryWithState } from "modules/categories/service";
export default function UpdateDebitChiPhi({ id, onClose ,price }: { id: any; onClose: () => void, price:number }) {
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({});
  const [productHaiquan, setProductHaiquan] = useState<any[]>([]);
  const [newHaiquan, setNewHaiquan] = useState<any>({ serviceId:"", name: "", price: "", note: "", bill: "", linkBill: "", codeBill: "" });
  const [productChiho, setProductChiho] = useState<any[]>([]);
  const [newChiho, setNewChiho] = useState<any>({ serviceId:"", name: "", price: "", note: "", bill: "", linkBill: "", codeBill: "" });
  // format tiền VN
  const formatCurrency = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  
  const { data: ChiPhis } = useListServiceCategoryWithState({type:0});
  const { data: ChiHos } = useListServiceCategoryWithState({type:1});
    // --- chuyển sang options bằng useMemo ---
  const ChiPhiOptions = useMemo(() => {
    if (!Array.isArray(ChiPhis)) return [];
    return ChiPhis.map((x: any) => ({
      label: x?.name ?? "(không tên)",
      value: x.id,
    }));
  }, [ChiPhis]);
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    infos.fileInfoId= infos.id;
    infos.productHaiquan= productHaiquan;
    infos.productChiho= productChiho;
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
       const response = await addDebitService(info);
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
  }, [id,partnerOptions.length,ChiPhiOptions.length,ChiHoOptions.length])
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
          <Panel header="Chi phí hải quan">
            <div className="formgrid grid">
              <div className="field col-3">
                 <Dropdown
                  filter
                   value={newHaiquan.name}
                  options={ChiPhiOptions}
                  onChange={(e: any) =>
                     {
                        const selected = e.value; // Đây là value (ví dụ: 123)
                        const option = ChiPhiOptions.find((x: any) => x.value === selected);
                         setNewHaiquan({ ...newHaiquan, name: selected, haiquan_info: {
                          id: selected,
                          name: option ? option.label : ''
                        } })  
                     }
                  }
                  label="Phí hải quan"
                  className="w-full"
                />
              </div>
              <div className="field col-3">
                <InputForm
                  className="w-full"
                  id="price"
                  value={newHaiquan.price}
                  onChange={(e: any) =>
                    setNewHaiquan({
                      ...newHaiquan,
                      price: formatCurrency(e.target.value),
                    })
                  }
                  label="Số tiền"
                />
              </div>
              <div className="field col-3">
                <InputForm
                  className="w-full"
                  id="note"
                  value={newHaiquan.note}
                  onChange={(e: any) =>
                    setNewHaiquan({ ...newHaiquan, note: e.target.value })
                  }
                  label="Ghi chú"
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
                    if (!newHaiquan.name || !newHaiquan.price)
                      return dispatch(showToast({ ...listToast[2], detail: "Nhập đủ thông tin hải quan" }));

                    // convert price về số khi push
                    const numericPrice = parseInt(newHaiquan.price.replace(/\D/g, ""), 10);

                    setProductHaiquan([
                      ...productHaiquan,
                      { ...newHaiquan, price: numericPrice,name: newHaiquan.haiquan_info.name,serviceId:newHaiquan.haiquan_info.id},
                    ]);

                    // reset input
                    setNewHaiquan({serviceId:"", name: "", price: "", note: "" });
                  }}
                />
              </div>
            </div>

            <div className="child-table">
              <DataTable rowHover value={productHaiquan}>
                <Column field="name" header="Phí hải quan" />
                   <Column
                      field="price"
                      header="Số tiền"
                      body={(row: any) => formatCurrency(row.price.toString())}
                      footer={formatCurrency(
                        productHaiquan
                          .reduce((sum, item) => sum + (item.price || 0), 0)
                          .toString()
                      )}
                      footerStyle={{ fontWeight: "bold" }}
                    />
                <Column field="note" header="Ghi chú" />
                <Column
                  header="Thao tác"
                  body={(_: any, opt: any) => (
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      onClick={() =>
                        setProductHaiquan(productHaiquan.filter((_, i) => i !== opt.rowIndex))
                      }
                    />
                  )}
                />
              </DataTable>
            </div>
          </Panel>
          <Panel header="Chi phí chi hộ">
            <div className="formgrid grid">
              <div className="field col-2">
                 <Dropdown
                  filter
                   value={newChiho.name}
                  options={ChiHoOptions}
                  onChange={(e: any) =>
                    {
                        const selected = e.value; // Đây là value (ví dụ: 123)
                        const option = ChiHoOptions.find((x: any) => x.value === selected);
                          setNewChiho({ ...newChiho, name: selected, chiho_info: {
                            id: selected,
                            name: option ? option.label : ''
                          } })
                    }
                  }
                  label="Phí chi hộ"
                  className="w-full"
                />
              </div>
              <div className="field col-2">
                <InputForm
                  className="w-full"
                  id="chiho_price"
                  value={newChiho.price}
                  onChange={(e: any) =>
                    setNewChiho({
                      ...newChiho,
                      price: formatCurrency(e.target.value),
                    })
                  }
                  label="Số tiền"
                />
              </div>
               <div className="field col-2">
                <InputForm
                  className="w-full"
                  id="chiho_bill"
                  value={newChiho.bill}
                  onChange={(e: any) =>
                    setNewChiho({ ...newChiho, bill: e.target.value })
                  }
                  label="Hóa đơn"
                />
              </div>
                <div className="field col-2">
                <InputForm
                  className="w-full"
                  id="chiho_linkBill"
                  value={newChiho.linkBill}
                  onChange={(e: any) =>
                    setNewChiho({ ...newChiho, linkBill: e.target.value })
                  }
                  label="Link hóa đơn"
                />
              </div>
               <div className="field col-2">
                <InputForm
                  className="w-full"
                  id="chiho_codeBill"
                  value={newChiho.codeBill}
                  onChange={(e: any) =>
                    setNewChiho({ ...newChiho, codeBill: e.target.value })
                  }
                  label="Mã hóa đơn"
                />
              </div>
              <div className="field col-1">
                <InputForm
                  className="w-full"
                  id="chiho_note"
                  value={newChiho.note}
                  onChange={(e: any) =>
                    setNewChiho({ ...newChiho, note: e.target.value })
                  }
                  label="Ghi chú"
                />
              </div>
              <div className="field col-1">
                <Button
                  type="button"
                  className="w-full p-button-normal"
                  label="Thêm"
                  severity="success"
                  raised
                  onClick={() => {
                    if (!newChiho.name || !newChiho.price)
                      return dispatch(showToast({ ...listToast[2], detail: "Nhập đủ thông tin chi hộ" }));

                    const numericPrice = parseInt(newChiho.price.replace(/\D/g, ""), 10);

                    setProductChiho([
                      ...productChiho,
                      { ...newChiho, price: numericPrice, name: newChiho.chiho_info.name ,serviceId:newChiho.chiho_info.id},
                    ]);

                    setNewChiho({serviceId:"", name: "", price: "", note: "" , bill: "", linkBill: "", codeBill: ""});
                  }}
                />
              </div>
            </div>

            <div className="child-table">
              <DataTable rowHover value={productChiho}>
                <Column field="name" header="Phí chi hộ" />
                <Column
                  field="price"
                  header="Số tiền"
                  body={(row: any) => formatCurrency(row.price.toString())}
                  footer={formatCurrency(
                    productChiho
                      .reduce((sum, item) => sum + (item.price || 0), 0)
                      .toString()
                  )}
                  footerStyle={{ fontWeight: "bold" }}  
                />
                <Column field="note" header="Ghi chú" />
                <Column
                  header="Thao tác"
                  body={(_: any, opt: any) => (
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      onClick={() =>
                        setProductChiho(productChiho.filter((_, i) => i !== opt.rowIndex))
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
              value={formatCurrency((
                productHaiquan.reduce((sum, item) => sum + (item.price || 0), 0) +
                productChiho.reduce((sum, item) => sum + (item.price || 0), 0)
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
