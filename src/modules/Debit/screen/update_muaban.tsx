
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Panel, RadioButton } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { useDispatch } from "react-redux";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { Dropdown, Input } from "components/common/ListForm";
import { useListPartnerDetail } from "modules/partner/service";
import { formOfPayment, listToast, refreshObject, TypeDoiTuong, VatDebit } from "utils";
import { addDebitDauKyKH, addDebitMuaBan, showDebit, updateDebitDauKyVaMuaBan } from "../api";
import { useListBankWithState, useListFundCategoryWithState, useListExpenseWithState, useListIncomeWithState } from "modules/categories/service";
import { useListEmployee } from "modules/employee/service";
import { showWithDebit } from "modules/receipt/api";
export default function UpdateMuaBan() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({vat:0,typeDoiTuong:0,accountingDate:Helper.toDayString(),formOfPayment:1 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [doiTuongOptions, setDoiTuongOptions] = useState<any>([]);
  const [employeeInfo, setEmployeeInfo] = useState<any>({});
  const [bankSelect, setBankSelect] = useState<any>({});
  const [lyDoOptions, setLyDoOptions] = useState<any[]>([]);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    infos.price = Helper.toInt(infos.price)
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
         const response = await updateDebitDauKyVaMuaBan(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/debit/ListMuaBan");
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
       const response = await addDebitMuaBan(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/debit/ListMuaBan");
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
   const { data: DMQuy } = useListFundCategoryWithState({type:1});
   const DMQuyOptions = useMemo(() => {
       if (!Array.isArray(DMQuy)) return [];
       return DMQuy.map((x: any) => ({
         label: x?.fund_name ?? "(không tên)",
         value: x.id,
       }));
     }, [DMQuy]);
   const { data: DMExpense } = useListExpenseWithState({type:1}); // danh mục chi phí
   const DMExpenseOptions = useMemo(() => {
       if (!Array.isArray(DMExpense)) return [];
       return DMExpense.map((x: any) => ({
         label: x?.name ?? "(không tên)",
         value: x.id,
       }));
     }, [DMExpense]);
       const { data: DMIncome } = useListIncomeWithState({type:0}); // danh mục chi phí
   const DMIncomeOptions = useMemo(() => {
       if (!Array.isArray(DMIncome)) return [];
       return DMIncome.map((x: any) => ({
         label: x?.name ?? "(không tên)",
         value: x.id,
       }));
     }, [DMIncome]);
   const { data: DMBank } = useListBankWithState({type:1});
   const DMBankOptions = useMemo(() => {
       if (!Array.isArray(DMBank)) return [];
       return DMBank.map((x: any) => ({
         label: x?.account_holder ?? "(không tên)",
         value: x.id,
       }));
     }, [DMBank]);
   const { data: employees } = useListEmployee({
     params: { keyword: "abc" },
     debounce: 500,
   });
   // lấy ra nhân viên giao nhận
   const nhanvienOptions = useMemo(() => {
     if (!Array.isArray(employees?.data)) return [];

     return employees.data.map((x: any, index: number) => ({
         label: `${index + 1}. ${x.last_name ?? ""} ${
           x.first_name ?? ""
         }`.trim(),
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
   
      if (id) {
        showWithDebit({ id: id }).then(res => {
          const detail = res.data.data
          if (detail) {
            let info = {
              ...detail, status: detail.status === 0 ? true : false,
            };
            setInfos(info)
            // set doiTuongOptions according to returned typeDoiTuong
          }
        }).catch(err => {
          //setHasError(true)
        });
      }
      // initialize with default mapped partner options
      setDoiTuongOptions(partnerOptions)
      setLyDoOptions(DMIncomeOptions)
      const employeeInfo = localStorage.getItem('employeeInfo') ? JSON.parse(localStorage.getItem('employeeInfo') || '{}') : null;
      setEmployeeInfo(employeeInfo);
      console.log(employeeInfo);
    }, [DMIncomeOptions,DMExpenseOptions,DMQuyOptions,DMBankOptions,partnerOptions, partnerVenderOptions, nhanvienOptions, id])
  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title=""
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/debit/ListMuaBan"
      >
        <div className="field">
          <Panel header="Thông tin">
             <h3 style={{ textAlign: "center",textTransform: 'uppercase' }}>
                 {infos.typeDoiTuong == 1? "mua hàng":"bán hàng"}
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
                  <div className="field col-6">
                    <Dropdown
                      value={infos.typeDoiTuong}
                      optionValue="value"
                      optionLabel="name"
                      options={TypeDoiTuong}
                      label="Đối tượng"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        {
                          const v = e.value;
                          // reset dependent selected id when type changes
                          setInfos({ ...infos, typeDoiTuong: v, maDoiTuong: undefined,incomeExpenseCategoryId:null })
                          if(v === 0){
                            setDoiTuongOptions(partnerOptions)
                            setLyDoOptions(DMIncomeOptions)
                          }else if(v === 1){
                            setDoiTuongOptions(partnerVenderOptions)
                            setLyDoOptions(DMExpenseOptions)
                          }
                          else{
                            setDoiTuongOptions(nhanvienOptions)
                            setLyDoOptions(DMIncomeOptions)
                          }
                        }
                      }
                      required
                    />
                  </div>
                  <div className="field col-6">
                     <Dropdown
                      value={infos.maDoiTuong}
                      optionValue="value"
                      optionLabel="label"
                      options={doiTuongOptions}
                      label="Đối tượng"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, maDoiTuong: e.value })
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
                      label="Người nhận"
                      disabled
                    />
                  </div>
                  <div className="field col-12">
                      <Dropdown
                      filter
                      value={infos.incomeExpenseCategoryId}
                      optionValue="value"
                      optionLabel="label"
                      options={lyDoOptions}
                      label="Lý do"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, incomeExpenseCategoryId: e.value })
                      }
                      required
                    />
                   </div>
                   <div className="field col-4">
                    <InputForm className="w-full"
                      id="price"
                      value={infos.price}
                      onChange={(e: any) =>
                         {
                           setInfos({ ...infos, price: Helper.formatCurrency(e.target.value )})
                           const thanhtien  = parseInt(e.target.value.replace(/\D/g, ""),10) + ( infos.vat ? ( parseInt(e.target.value.replace(/\D/g, ""),10) * infos.vat ) / 100 : 0  );
                           setInfos({ ...infos, price: Helper.formatCurrency(e.target.value ), thanhtien : Helper.formatCurrency(thanhtien.toString()) })
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
                             const thanhtien  = parseInt( infos.price.replace(/\D/g, ""),10) + ( e.value ? ( parseInt( infos.price.replace(/\D/g, ""),10) * e.value ) / 100 : 0  );
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
                      required
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

