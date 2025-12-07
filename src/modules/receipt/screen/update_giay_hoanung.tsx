
import { UpdateForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Column, DataTable, Panel } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject } from "utils";
import { giayHoanUng } from "../api";
import { useDispatch } from "react-redux";
import { Helper } from "utils/helper";
import { useListEmployeeWithState } from "modules/employee/service";
import { useListBankWithState, useListFundCategoryWithState, useListExpenseWithState } from "modules/categories/service";
export default function UpdateGiayHoanUng({ debits, onClose, employeeId,fromDate,toDate}: { debits: any, onClose: () => void,employeeId:number,fromDate:any,toDate:any }) {
  const amount = Math.abs(debits.reduce((sum: number, item: any) => sum + (item.phaiTra || 0), 0));
  const check_amount = debits.reduce((sum: number, item: any) => sum + (item.phaiTra || 0), 0);
  const description = "Từ ngày "+Helper.formatDMY(new Date(fromDate))+" đến ngày "+Helper.formatDMY(new Date(toDate));
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState<any>({});
  const [bankSelect, setBankSelect] = useState<any>({});
  const [debitRows, setDebitRows] = useState<any[]>([]);
  const [nhanVienGiaoNhan, setNhanVienGiaoNhan] = useState<any>();
  const [infos, setInfos] = useState<any>({vat:0,type_doi_tuong:0,accountingDate:Helper.toDayString(),formOfPayment:1 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    let info = {
      ...infos,
      data: JSON.stringify(debits.map((x: any) => ({
         fileInfoId: x.id,
         fileName:x.file_number,
         dienGiai:x.file_number+" KH_"+x.customerAbb,
         receipt_total:x.receipt_total,
         sumCH:x.sumCH,
         sumHQ:x.sumHQ,
         phaiTra:x.phaiTra
      }))),
      description:description,
      amount:amount,
      employeeId:employeeId,
      typeReceipt:check_amount > 0 ? 3 : 2
    };
    console.log(info);
    setLoading(true);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
    const response = await giayHoanUng(info);
    if (response) setLoading(false);
    if (response.status === 200) {
      if (response.data.status) {
        setInfos({ ...refreshObject(infos), status: true });
        dispatch(
          showToast({ ...listToast[0], detail: response.data.message })
        );
        onClose();
      } else {
        dispatch(
          showToast({ ...listToast[2], detail: response.data.message })
        );
      }
    } else
      dispatch(
        showToast({ ...listToast[1], detail: response.data.message })
      );
  };

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
         label: x?.name ?? "(không tên)",
         value: x.id,
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
  function GetBank(id:Number){
     const selected = DMBank.find((x: any) => x.id === id);
     setBankSelect(selected || {});
  }
 
  useEffect(() => {
      const employeeInfo = localStorage.getItem('employeeInfo') ? JSON.parse(localStorage.getItem('employeeInfo') || '{}') : null;
      setEmployeeInfo(employeeInfo);
      // Chọn mặc định nhân viên giao nhận đầu tiên
      if (employees && employees.length > 0) {
          const _nvgiaonhan = employees.find((x:any)=>x.id == employeeId)
          setNhanVienGiaoNhan(`${_nvgiaonhan.last_name ?? ""} ${_nvgiaonhan.first_name ?? ""}`.trim())
      }
      if(debits && debits.length > 0){
         setDebitRows(debits)
      }
    }, [debits,employees])
  return (
    <>
      <UpdateForm       
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        loading={loading}
        onSubmit={handleSubmit}
        route={Number(id) ? "/receipt/update" : "/receipt/create"}
        AddName="Tạo hoàn ứng"
      >
        <div className="field">
          <Panel header="Thông tin">
            <h3 style={{ textAlign: "center",textTransform: 'uppercase' }}>
                 Giấy hoàn ứng
            </h3>
            <div className="field" style={{ textAlign: "center" }}><i>{description}</i></div> 
            <div className="grid">
              <div className="col-12">
                <div className="formgrid grid">
                  <div className="field col-12">
                     <div>Ngày tạo: {Helper.formatDMY(new Date(infos.accountingDate))}</div>
                     <div>Họ và tên: {nhanVienGiaoNhan}</div>
                  </div>
                   <div className="field col-12">
                     <div><b>Thông tin chi tiết</b></div>
                        <DataTable 
                          rowHover 
                          value={debitRows}
                          scrollable
                          scrollHeight="flex"
                          style={{ flex: 1 }}
                        >
                            <Column 
                              header="STT" 
                              body={(rowData:any, options:any) => options.rowIndex + 1}
                            />
                            <Column 
                              header="Diễn giải" 
                              body={(row: any) => row.file_number+" KH_"+row.customerAbb }
                            />
                            <Column body={(row: any) => Helper.formatCurrency(row.receipt_total.toString())} header="Tạm ứng" />
                            <Column body={(row: any) => Helper.formatCurrency((row.sumHQ+row.sumCH).toString())} header="Chi phí" />
                            <Column 
                              body={(row: any) => Helper.formatCurrency(row.phaiTra.toString())} 
                              header="Hoàn lại" 
                              footer={Helper.formatCurrency(
                              debits.reduce((sum:any, item:any) => sum + (item.phaiTra || 0), 0)
                              .toString()
                                )}
                              footerStyle={{ fontWeight: "bold" }}
                            />
                        </DataTable>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </UpdateForm>
    </>
  );
}

