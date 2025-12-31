
import { UpdateForm } from "components/common/AddForm";
import { useEffect, useMemo, useState } from "react";
import { Column, DataTable, Panel, RadioButton } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject } from "utils";
import { AddHoanTraTamThu, HuyHoanTraTamThu } from "../api";
import { useDispatch } from "react-redux";
import { Helper } from "utils/helper";
import { useListEmployeeWithState } from "modules/employee/service";
import { useListBankWithState, useListFundCategoryWithState } from "modules/categories/service";
export default function UpdateHoanTraTamThuGiaoNhan({debits, onClose}: {debits: any, onClose: () => void }) {
  const amount = debits.reduce((sum: number, item: any) => {
                  const conlai = (item.conlai_dv || 0) + (item.conlai_ch || 0);
                  return sum + conlai;
                }, 0);
  const [loading, setLoading] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState<any>({});
  const [bankSelect, setBankSelect] = useState<any>({});
  const [infos, setInfos] = useState<any>({vat:0,type_doi_tuong:0,accountingDate:Helper.toDayString(),formOfPayment:1});
  const dispatch = useDispatch();
  const handleSubmit = (e: any) => {
    e.preventDefault();
  };
  async function HoanTra() {
    infos.Debits = JSON.stringify(debits);
    infos.amount = amount;  
    let info = {
      ...infos,
      data: JSON.stringify(infos),
    };
    const response = await AddHoanTraTamThu(info);
    if (response) setLoading(false);
    if (response.status === 200) {
      if (response.data.status) {
        setInfos({ ...refreshObject(infos), status: true })
        dispatch(showToast({ ...listToast[0], detail: response.data.message }));
        onClose();
      }
      else {
        dispatch(showToast({ ...listToast[2], detail: response.data.message }))
      }
    } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
  };
  async function HuyHoanTra() {
    infos.Debits = JSON.stringify(debits);
    infos.amount = amount;
    let info = {
      ...infos,
      data: JSON.stringify(infos),
    };
    const response = await HuyHoanTraTamThu(info);
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
  };
   const { data: DMQuy } = useListFundCategoryWithState({type:1});
   const DMQuyOptions = useMemo(() => {
       if (!Array.isArray(DMQuy)) return [];
       return DMQuy.map((x: any) => ({
         label: x?.fund_name ?? "(không tên)",
         value: x.id,
       }));
     }, [DMQuy]);
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
  function GetBank(id:Number){
     const selected = DMBank.find((x: any) => x.id === id);
     setBankSelect(selected || {});
  }
 
  useEffect(() => {
      const employeeInfo = localStorage.getItem('employeeInfo') ? JSON.parse(localStorage.getItem('employeeInfo') || '{}') : null;
      setEmployeeInfo(employeeInfo);
    }, [debits,employees])
  return (
    <>
      <UpdateForm       
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        loading={loading}
        onSubmit={handleSubmit}
        route="/receipt/create"
        Cancel={{Name:"Hủy hoàn trả", Action: () => HuyHoanTra()}}
        Accept={{Name:"Hoàn trả", Action: () => HoanTra()}}
      >
        <div className="field">
          <Panel header="Thông tin">
            <h3 className="field" style={{ textAlign: "center",textTransform: 'uppercase' }}>
              Phiếu hoàn trả tạm thu giao nhận
            </h3>
            <div className="grid">
                 <div className="field col-12">
                     <div><b>Thông tin chi tiết</b></div>
                        <DataTable 
                          rowHover 
                          value={debits}
                          scrollable
                          scrollHeight="flex"
                          style={{ flex: 1 }}
                        >
                            <Column  body={(rowData:any, options:any) => options.rowIndex + 1} />
                            <Column field="customerAbb" header="Tên khách hàng"/>
                            <Column header="Số file"
                            body={(row: any) =>{
                                let data = JSON.parse(row.data);
                                return data?.fileNumber
                            }}/>
                            <Column field="name" header="Nội dung"/>
                            <Column  header="Phí Cược" 
                            body={(row: any) =>{
                              if(row.service_id === 19){
                                  const price = typeof row.price === "string"
                                    ? parseFloat(row.price.replace(/[^0-9.]/g, "")) || 0
                                    : Number(row.price) || 0;
                                  const thanh_tien = Math.round(price);
                                  return Helper.formatCurrency(thanh_tien.toString());
                              }
                            }}/>
                            <Column  header="Phí Tạm Thu" 
                             body={(row: any) =>{
                              if(row.service_id === 33){
                                  const price = typeof row.price === "string"
                                    ? parseFloat(row.price.replace(/[^0-9.]/g, "")) || 0
                                    : Number(row.price) || 0;
                                  const thanh_tien = Math.round(price);
                                  return Helper.formatCurrency(thanh_tien.toString());
                              }
                            }}/>
                            <Column 
                              header="Số tiền thu" 
                               body={(row: any) => {
                                  const conlai = (row.conlai_dv || 0) + (row.conlai_ch || 0);
                                  return Helper.formatCurrency(conlai.toString());
                                }}
                                footer={Helper.formatCurrency(
                                  debits.reduce((sum: number, item: any) => {
                                      const conlai = (item.conlai_dv || 0) + (item.conlai_ch || 0);
                                      return sum + conlai;
                                  }, 0).toString()
                                )}
                                footerStyle={{ fontWeight: "bold" }}
                            />
                        </DataTable>
                  </div>
            </div>
          </Panel>
        </div>
      </UpdateForm>
    </>
  );
}

