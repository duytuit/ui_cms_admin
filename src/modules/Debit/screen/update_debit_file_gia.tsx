
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, loaiToKhai, refreshObject, typeDebit, VatDebit } from "utils";
import { useDispatch, useSelector } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { addDebit, addDebitService, showDebit, showDebitByFileId, updateDebit } from "../api";
import { Dropdown, Input, MultiSelect } from "components/common/ListForm";
import { Column, DataTable, Panel } from "components/uiCore";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import React from "react";
import { showContractFile } from "modules/ContractFile/api";
import { useListPartnerDetail } from "modules/partner/service";
import { useListIncomeExpenseWithState, useListServiceCategoryWithState } from "modules/categories/service";
export default function UpdateFileGia({ id, onClose }: { id: any; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({});
  const [productHaiquan, setProductHaiquan] = useState<any[]>([]);
  const [newHaiquan, setNewHaiquan] = useState<any>({ name: "", price: "",vat:0,thanh_tien:"", note: "", bill: "", link_bill: "", code_bill: "" });
  const [productChiho, setProductChiho] = useState<any[]>([]);
  const [newChiho, setNewChiho] = useState<any>({ name: "", price: "",vat:0,thanh_tien:"", note: "", bill: "", link_bill: "", code_bill: "" });
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
    let info = {
      ...infos, status: infos.status ? 0 : 1,
      productHaiquan: productHaiquan,
      productChiho: productChiho,
      data:JSON.stringify(infos)
    };
    console.log('info', info);
    setLoading(true);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
    if (info.id) {
       const response = await updateDebit(info);
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
      showDebitByFileId({ FileId: id}).then(res => {
        const detail = res.data.data
        if (detail) {
          const employeeInfo = localStorage.getItem('employeeInfo') ? JSON.parse(localStorage.getItem('employeeInfo') || '{}') : null;
          const _loaiToKhai = loaiToKhai.find( (x: any) => x.DeclarationType === detail.declarationType);
          const partner = partnerOptions.find((x:any)=>x.value == detail.partnerDetailId)
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
                        <div><label className="font-medium">Nhân viên:</label> {`${infos?.EmployeeStaffInfo?.lastName ?? ""} ${infos?.EmployeeStaffInfo?.firstName ?? ""}`.trim()}</div>
                        <div><label className="font-medium">Được duyệt:</label> {infos?.confirm_price ? Helper.formatCurrency(infos?.confirm_price.toString()) : 0}</div>
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
          <Panel header="Chi tiết các chi phí">
            {/* <div className="formgrid grid">
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
                      price: Helper.formatCurrency(e.target.value),
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
                    const thanh_tien = Math.round( numericPrice * (1 + (newHaiquan.vat || 0) / 100) );
                    setProductHaiquan([
                      ...productHaiquan,
                      { ...newHaiquan, price: numericPrice,name: newHaiquan.haiquan_info.name, thanh_tien: Helper.formatCurrency(thanh_tien.toString()) },
                    ]);

                    // reset input
                    setNewHaiquan({ name: "", price: "", note: "" });
                  }}
                />
              </div>
            </div> */}

            <div className="child-table">
              <DataTable rowHover value={productHaiquan}>
                <Column field="name" header="Chi phí" />
                <Column
                  field="purchasePrice"
                  header="Giá mua"
                  body={(row: any) => Helper.formatCurrency(row.purchasePrice.toString())}
                  footer={Helper.formatCurrency(
                    productHaiquan
                      .reduce((sum, item) => sum + (item.purchasePrice || 0), 0)
                      .toString()
                  )}
                  footerStyle={{ fontWeight: "bold" }}
                />
                <Column
                  field="price"
                  header="Giá bán"
                  body={(row: any) => Helper.formatCurrency(row.price.toString())}
                  footer={Helper.formatCurrency(
                    productHaiquan
                      .reduce((sum, item) => sum + (item.price || 0), 0)
                      .toString()
                  )}
                  footerStyle={{ fontWeight: "bold" }}
                />
                <Column
                  header="VAT"
                  body={(_: any, opt: any) => (
                    <Dropdown
                      value={productHaiquan[opt.rowIndex].vat}
                      optionValue="vat"
                      optionLabel="name"
                      options={VatDebit}
                      className="p-inputtext-sm"
                      onChange={(e: any) =>
                         {
                              const thanh_tien = Math.round( productHaiquan[opt.rowIndex].price * (1 + (e.target.value || 0) / 100) );
                              const updatedProductHaiquan = [...productHaiquan];
                              updatedProductHaiquan[opt.rowIndex] = {
                                ...updatedProductHaiquan[opt.rowIndex],
                                vat: e.target.value,
                                thanh_tien: Helper.formatCurrency(thanh_tien.toString())
                              };
                              setProductHaiquan(updatedProductHaiquan);
                          }
                      }
                 
                      required
                    />
                  )}
                />
                <Column 
                field="thanh_tien" 
                header="Thành tiền"
                footer={Helper.formatCurrency(
                  productHaiquan.reduce((sum, item) => sum + (item.thanh_tien ? parseInt(item.thanh_tien.replace(/\D/g, ""), 10) : 0), 0).toString()
                )}
                footerStyle={{ fontWeight: "bold" }}
                />
                <Column field="bill" header="Hóa đơn" />
              </DataTable>
            </div>
          </Panel>
          {/* thêm dòng tổng cộng nằm bên phải */}
          <div className="field mt-4">
            <InputForm
              className="w-64"
              id="total_price"
              value={0}
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