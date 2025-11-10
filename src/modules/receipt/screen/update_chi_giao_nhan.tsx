
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Panel, RadioButton } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { formOfPayment, listToast, refreshObject, VatDebit } from "utils";
import { updateReceipt, addReceipt, showReceipt, addReceiptChiGiaoNhan, updateReceiptChiGiaoNhan } from "../api";
import { useDispatch } from "react-redux";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { Dropdown, Input } from "components/common/ListForm";
import { useListEmployee, useListEmployeeWithState } from "modules/employee/service";
import { useListPartnerDetail } from "modules/partner/service";
import { useListBankWithState, useListFundCategoryWithState, useListIncomeExpenseWithState } from "modules/categories/service";
import { useListContractFile } from "modules/ContractFile/service";
export default function UpdateReceiptChiGiaoNhan() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [doiTuongOptions, setDoiTuongOptions] = useState<any>([]);
  const [employeeInfo, setEmployeeInfo] = useState<any>({});
  const [bankSelect, setBankSelect] = useState<any>({});
  const [ContractFileOptions, setContractFileOptions] = useState<any[]>([]);
  const [nhanVienGiaoNhanOptions, setNhanVienGiaoNhanOptions] = useState<any[]>([]);
  const [infos, setInfos] = useState<any>({vat:0,type_doi_tuong:0,accountingDate:Helper.toDayString(),formOfPayment:1 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    let info = {
      ...infos, amount: parseInt(infos.amount.replace(/\D/g, ""), 10),thanhtien: parseInt(infos.thanhtien.replace(/\D/g, ""), 10), status: infos.status ? 0 : 1,
     data:JSON.stringify(infos)
    };
    setLoading(true);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
   
     if (info.id) {
         const response = await updateReceiptChiGiaoNhan(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/receipt/listReceiptChiGiaoNhan");
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
       const response = await addReceiptChiGiaoNhan(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/receipt/listReceiptChiGiaoNhan");
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
 const { data: ContractFile } = useListContractFile({
     params: {f:"abc"},
     debounce: 500,
 }); 
 useEffect(() => {
  const list = ContractFile.data;
  if (Array.isArray(list) && list.length > 0) {
    const opts = list.map((x: any) => ({
      label: x?.file_number ?? "(không tên)",
      value: x.id,
    }));
    setContractFileOptions(opts);
  }
}, [ContractFile]);

   const { data: DMQuy } = useListFundCategoryWithState({type:1});
   const DMQuyOptions = useMemo(() => {
       if (!Array.isArray(DMQuy)) return [];
       return DMQuy.map((x: any) => ({
         label: x?.fund_name ?? "(không tên)",
         value: x.id,
       }));
     }, [DMQuy]);
   const { data: DMExpense } = useListIncomeExpenseWithState({type:1}); // danh mục chi phí
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
  function GetNhanVienGiaoNhan(fileId:Number){
        setNhanVienGiaoNhanOptions([]);
        setInfos({ ...infos, fileInfoId: fileId })
        if (!Array.isArray(ContractFile?.data) || !Array.isArray(employees)) return setNhanVienGiaoNhanOptions([]);

        // 1️⃣ Lấy file theo id
        const file = ContractFile.data.find((x: any) => x.id === fileId);
        if (!file || !Array.isArray(file.file_info_details)) return setNhanVienGiaoNhanOptions([]);

        // 2️⃣ Lấy danh sách employee_id từ file_info_details
        const employeeIds = file.file_info_details.map((x: any) => x.employee_id);
        
        // 3️⃣ Lọc các nhân viên tương ứng
        const nhanVienGiaoNhan = employees.filter((e: any) => employeeIds.includes(e.id));
        
        // 4️⃣ Map ra option {label, value} nếu cần
        const _nhanVienGiaoNhan = nhanVienGiaoNhan.map((e: any, i: number) => ({
          label: `${i + 1}. ${e.last_name ?? ""} ${e.first_name ?? ""}`.trim(),
          value: e.id,
        }));
        if(_nhanVienGiaoNhan.length > 0){
            setNhanVienGiaoNhanOptions(_nhanVienGiaoNhan);
        }
  }
  useEffect(() => {
      const employeeInfo = localStorage.getItem('employeeInfo') ? JSON.parse(localStorage.getItem('employeeInfo') || '{}') : null;
      setEmployeeInfo(employeeInfo);
      if (id) {
        showReceipt({ id: id, type: CategoryEnum.country }).then(res => {
          const detail = res.data.data
          if (detail) {
            GetNhanVienGiaoNhan(detail.fileInfoId)
            GetBank(detail.bankId)
            const _nguoitao = employees.find((x: any) => x.user_id === detail.updatedBy);
            setEmployeeInfo(_nguoitao);
            detail.amount = Helper.formatCurrency(detail.receiptDetails[0].amount.toString())
            detail.vat = detail.receiptDetails[0].vat
            detail.thanhtien =Helper.formatCurrency((detail.receiptDetails[0].amount + (detail.receiptDetails[0].amount * detail.receiptDetails[0].vat/100)).toString())
            let info = {
              ...detail, status: detail.status === 0 ? true : false,
            };
            setInfos(info)
            
          }
        }).catch(err => {
          //setHasError(true)
        });
      }
      
    }, [ContractFile,id])
  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title="phiếu chi"
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/receipt/listReceiptChiGiaoNhan"
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
                      filter
                      value={infos.fileInfoId}
                      optionValue="value"
                      optionLabel="label"
                      options={ContractFileOptions}
                      label="Số file"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        GetNhanVienGiaoNhan(e.value)
                      }
                      required
                    />
                  </div>
                  <div className="field col-6">
                    <Dropdown
                      value={infos.employeeId}
                      optionValue="value"
                      optionLabel="label"
                      options={nhanVienGiaoNhanOptions}
                      label="Người giao nhận"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, employeeId: e.value })
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
                      required
                    />
                  </div>
                   <div className="field col-4">
                    <InputForm className="w-full"
                      id="Amount"
                      value={infos.amount}
                      onChange={(e: any) =>
                         {
                           setInfos({ ...infos, amount: Helper.formatCurrency(e.target.value )})
                           const thanhtien  = parseInt(e.target.value.replace(/\D/g, ""),10) + ( infos.vat ? ( parseInt(e.target.value.replace(/\D/g, ""),10) * infos.vat ) / 100 : 0  );
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
                             setInfos({ ...infos, vat: e.value })
                             const thanhtien  = parseInt( infos.amount.replace(/\D/g, ""),10) + ( e.value ? ( parseInt( infos.amount.replace(/\D/g, ""),10) * e.value ) / 100 : 0  );
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
      </AddForm>
    </>
  );
}

