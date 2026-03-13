
import { InputForm, UpdateForm } from "components/common/AddForm";
import { useEffect, useMemo, useState } from "react";
import { Column, DataTable, Panel, RadioButton } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { formOfPayment, listToast, refreshObject } from "utils";
import { updateHoanUngGiaoNhan, updateReceiptChiGiaoNhan } from "../api";
import { useDispatch } from "react-redux";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { Dropdown, Input } from "components/common/ListForm";
import { useListEmployeeWithState } from "modules/employee/service";
import { useListBankWithState, useListFundCategoryWithState, useListIncomeExpenseWithState } from "modules/categories/service";
export default function UpdateChiLaiXe({ detail, onClose}: {detail:any,onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState<any>({});
  const [bankSelect, setBankSelect] = useState<any>({});
  const [nhanVienGiaoNhan, setNhanVienGiaoNhan] = useState<any>();
  const [infos, setInfos] = useState<any>({vat:0,type_doi_tuong:0,accountingDate:Helper.toDayString(),formOfPayment:1,incomeExpenseCategoryId:38});
  const dispatch = useDispatch();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    let info = {
      ...infos,
      id:detail.id,
      status:1
    };
    console.log(info);
    setLoading(true);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
    const response = await updateHoanUngGiaoNhan(info);
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
   const { data: DMExpense } = useListIncomeExpenseWithState({}); // danh mục chi phí
   const DMExpenseOptions = useMemo(() => {
       if (!Array.isArray(DMExpense)) return [];
       return DMExpense.map((x: any) => ({
         label: x?.name ?? "(không tên)",
         value: x.id,
       }));
     }, [DMExpense]);
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
         label: x?.account_holder ?? "(không tên)",
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
      if (detail&&employees && employees.length > 0) {
          const _nvgiaonhan = employees.find((x:any)=>x.id == detail.employee_id)
          setNhanVienGiaoNhan(`${_nvgiaonhan.last_name ?? ""} ${_nvgiaonhan.first_name ?? ""}`.trim())
      }
    }, [detail,employees])
  return (
    <>
      <UpdateForm       
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        loading={loading}
        onSubmit={handleSubmit}
        route={Number(detail.id) ? "/receipt/update" : "/receipt/create"}
        AddName="Tạo phiếu chi lái xe"
      >
        <div className="field">
          <Panel header="Thông tin">
            <h3 className="field" style={{ textAlign: "center",textTransform: 'uppercase' }}>
               Phiếu chi lái xe
            </h3>
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
                  <div className="field col-12">
                     <Input
                      id="sales"
                      value={nhanVienGiaoNhan}
                      className="w-full"
                      label="Giao nhận"
                      disabled
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
                    <InputForm className="w-full p-inputtext-sm" id="Amount" label="Số tiền" disabled />
                  </div>
                   <div className="field col-12">
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
                      disabled
                    />
                  </div>
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
                   <div className="field col-12">
                     <div><b>Thông tin chi tiết</b></div>
                        <DataTable 
                          rowHover 
                          value={[]}
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
                              body={(row: any) => row.dienGiai }
                            />
                           
                        </DataTable>
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
        </div>
      </UpdateForm>
    </>
  );
}

