
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, loaiToKhai, refreshObject, typeDebit } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { addDebit, showDebit, updateDebit } from "../api";
import { Dropdown, MultiSelect } from "components/common/ListForm";
import { Column, DataTable, Panel } from "components/uiCore";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import React from "react";
import { showContractFile } from "modules/ContractFile/api";
export default function UpdateDebitChiPhi({ id }: { id: any }) {
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({});
  const [productHaiquan, setProductHaiquan] = useState<any[]>([]);
  const [newHaiquan, setNewHaiquan] = useState<any>({ name: "", price: "", note: "", bill: "", link_bill: "", code_bill: "" });
  const [productChiho, setProductChiho] = useState<any[]>([]);
  const [newChiho, setNewChiho] = useState<any>({ name: "", price: "", note: "", bill: "", link_bill: "", code_bill: "" });
  // format tiền VN
  const formatCurrency = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let info = {
      ...infos, status: infos.status ? 0 : 1,
      productHaiquan: productHaiquan,
      productChiho: productChiho,
    };
    console.log('info', info);
    // setLoading(true);
    // fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
    if (info.id) {
      const response = await updateDebit(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          navigate('/debit/list');
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    } else {
      const response = await addDebit(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          setInfos({ ...refreshObject(infos), status: true })
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          navigate('/debit/list');
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    }
  };
  useEffect(() => {
    if (id) {
      setLoading(true);
      showContractFile({ id: id, type: CategoryEnum.country }).then(res => {
        const detail = res.data.data
        if (detail) {
          const _loaiToKhai = loaiToKhai.find( (x: any) => x.DeclarationType === detail.declarationType);
          let info = {
            ...detail, status: detail.status === 0 ? true : false,
             loaiToKhai:_loaiToKhai?.name
          };
          setInfos(info)
        }
      }).catch(err => {
        //setHasError(true)
      }).finally(() => setLoading(false));
    }
  }, [id])
   if (loading) return (<></>);
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
                      <span>{infos.fileNumber}</span>
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
                      <InputForm
                        className="w-full"
                        id="employee_name"
                        label="Người giao nhận"
                      />
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
                      value={Helper.formatDMYLocal(infos.accountingDate ? infos.accountingDate : '')}
                      dateFormat="dd/mm/yy"
                      onChange={(e: any) =>
                      setInfos({ ...infos, accountingDate: e })}
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
                <InputForm
                  className="w-full"
                  id="name"
                  value={newHaiquan.name}
                  onChange={(e: any) =>
                    setNewHaiquan({ ...newHaiquan, name: e.target.value })
                  }
                  label="Phí hải quan"
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
                      return dispatch(showToast({ ...listToast[2], detail: "Nhập đủ thông tin" }));

                    // convert price về số khi push
                    const numericPrice = parseInt(newHaiquan.price.replace(/\D/g, ""), 10);

                    setProductHaiquan([
                      ...productHaiquan,
                      { ...newHaiquan, price: numericPrice },
                    ]);

                    // reset input
                    setNewHaiquan({ name: "", price: "", note: "" });
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
              <div className="field col-3">
                <InputForm
                  className="w-full"
                  id="chiho_name"
                  value={newChiho.name}
                  onChange={(e: any) =>
                    setNewChiho({ ...newChiho, name: e.target.value })
                  }
                  label="Phí chi hộ"
                />
              </div>
              <div className="field col-3">
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
              <div className="field col-3">
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
              <div className="field col-3">
                <Button
                  type="button"
                  className="w-full p-button-normal"
                  label="Thêm"
                  severity="success"
                  raised
                  onClick={() => {
                    if (!newChiho.name || !newChiho.price)
                      return dispatch(showToast({ ...listToast[2], detail: "Nhập đủ thông tin" }));

                    const numericPrice = parseInt(newChiho.price.replace(/\D/g, ""), 10);

                    setProductChiho([
                      ...productChiho,
                      { ...newChiho, price: numericPrice },
                    ]);

                    setNewChiho({ name: "", price: "", note: "" });
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
        </div>
      </AddForm>
    </>
  );
}
