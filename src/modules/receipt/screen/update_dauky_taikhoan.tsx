
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
import { formOfPayment, listToast, refreshObject, TypeDebitDKKH, VatDebit } from "utils";
import { addDebitDauKyKH, showDebit, updateDebitDauKyVaMuaBan } from "modules/Debit/api";
import { useListBankWithState, useListExpenseWithState, useListFundCategoryWithState } from "modules/categories/service";
export default function UpdateDauKyTaiKhoan() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [bankSelect, setBankSelect] = useState<any>({});
  const [infos, setInfos] = useState<any>({vat:0,type_doi_tuong:0,accountingDate:Helper.toDayString(),formOfPayment:1,incomeExpenseCategoryId:15 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const handleSubmit = (e: any) => {
    e.preventDefault();
    infos.price = Helper.toInt(infos.price)
    let info = {
      ...infos,
     data:JSON.stringify(infos)
    };
    setLoading(true);
    fetchDataSubmit(info);
  };
    function GetBank(id:Number){
     const selected = DMBank.find((x: any) => x.id === id);
     setBankSelect(selected || {});
  }
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
           navigate("/receipt/ListDauKyTaiKhoan");
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
       const response = await addDebitDauKyKH(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/receipt/ListDauKyTaiKhoan");
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
  useEffect(() => {
      if (id) {
        showDebit({ id: id, }).then(res => {
          const detail = res.data.data
          if (detail) {
            detail.price = Helper.formatCurrency(detail.price.toString())
            let info = {
              ...detail
            };
            setInfos(info)
          }
        }).catch(err => {
          //setHasError(true)
        });
      }
      
    }, [id])
  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title="số dư tài khoản"
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/receipt/ListDauKyTaiKhoan"
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
                    <label htmlFor="">Hình thức</label>
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
                   <div className="field col-6">
                    <InputForm className="w-full"
                      id="note"
                      value={infos.note}
                      onChange={(e: any) =>
                        setInfos({ ...infos, note: e.target.value })
                      }
                      label="Ghi chú"
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

