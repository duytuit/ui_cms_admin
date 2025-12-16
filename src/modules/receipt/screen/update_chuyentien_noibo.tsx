
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Panel, RadioButton } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { formOfPayment, listToast, refreshObject } from "utils";
import { showReceipt, addReceiptChiGiaoNhan, updateReceiptChiGiaoNhan, updateChuyentiennoibo, addChuyentiennoibo, showChuyenTienNoiBo } from "../api";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { Dropdown, Input } from "components/common/ListForm";
import { useListBankWithState, useListFundCategoryWithState, useListExpenseWithState } from "modules/categories/service";
export default function UpdateChuyenTienNoiBo() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [bankFromSelect, setBankFromSelect] = useState<any>({});
  const [bankToSelect, setBankToSelect] = useState<any>({});
  const [infos, setInfos] = useState<any>({accountingDate:Helper.toDayString() });
  const [from, setFrom] = useState<any>({formOfPayment:1});
  const [to, setTo] = useState<any>({formOfPayment:1 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    infos.ChuyenTu = from;
    infos.ChuyenDen = to;
    let info = {
      ...infos, amount: parseInt(infos.amount.replace(/\D/g, ""), 10),
     data:JSON.stringify(infos)
    };
    console.log(info);
    setLoading(true);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
   
     if (info.id) {
         const response = await updateChuyentiennoibo(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/receipt/ListChuyenTienNoiBo");
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
       const response = await addChuyentiennoibo(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/receipt/ListChuyenTienNoiBo");
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
   const { data: DMBank } = useListBankWithState({type:1});
   const DMBankOptions = useMemo(() => {
       if (!Array.isArray(DMBank)) return [];
       return DMBank.map((x: any) => ({
         label: `${x.account_number} - ${x.account_holder}`,
         value: x.id,
       }));
     }, [DMBank]);
  function GetBankFrom(id:Number){
     const selected = DMBank.find((x: any) => x.id === id);
     setBankFromSelect(selected || {});
  }
  function GetBankTo(id:Number){
     const selected = DMBank.find((x: any) => x.id === id);
     setBankToSelect(selected || {});
  }
  
  useEffect(() => {
      if (id) {
        showChuyenTienNoiBo({ id: id }).then(res => {
          const detail = res.data.data
          if (detail) {
            const amount = Helper.formatCurrency( detail.price.toString())
            let info = {
              ...detail,amount
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
        title="chuyển tiền nội bộ"
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/receipt/ListChuyenTienNoiBo"
        route={Number(id) ? "/receipt/update" : "/receipt/create"}
      >
        <div className="field">
          <Panel header="Thông tin">
            <div className="col-12">
              <div className="formgrid grid">
                <div className="field col-2">
                  <MyCalendar
                    dateFormat="dd/mm/yy"
                    value={Helper.formatDMYLocal(
                      infos.accountingDate ? infos.accountingDate : ""
                    )} // truyền nguyên ISO string
                    onChange={(e: any) =>
                      setInfos({ ...infos, accountingDate: e })
                    }
                    className={classNames(
                      "w-full",
                      "p-inputtext",
                      "input-form-sm"
                    )}
                  />
                </div>
                <div className="field col-4">
                  <InputForm
                    className="w-full"
                    id="Amount"
                    value={infos.amount}
                    onChange={(e: any) => {
                      setInfos({
                        ...infos,
                        amount: Helper.formatCurrency(e.target.value),
                      });
                    }}
                    label="Số tiền"
                    required
                  />
                </div>
                <div className="field col-6">
                  <InputForm
                    className="w-full"
                    id="note"
                    value={infos.note}
                    onChange={(e: any) =>
                      setInfos({ ...infos, note: e.target.value })
                    }
                    label="Diễn giải"
                  />
                </div>
                <div className="field col-6">
                  <Panel header="Chuyển từ">
                    <div className="grid">
                      <div className="field col-6">
                        <label htmlFor="">Hình thức thanh toán</label>
                        <div className="flex flex-wrap gap-3">
                          {formOfPayment.map((item) => (
                            <div
                              key={item.value}
                              className="flex align-items-center"
                            >
                              <RadioButton
                                inputId={`payment_from_${item.value}`}
                                name="formOfPayment"
                                value={item.value}
                                onChange={(e: any) =>
                                  setFrom({ ...from, formOfPayment: e.value })
                                }
                                checked={from.formOfPayment == item.value}
                              />
                              <label
                                htmlFor={`payment_from_${item.value}`}
                                className="ml-2"
                              >
                                {item.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="field col-6">
                         {from.formOfPayment == 2 && (<div className="formgrid grid">
                          <div className="col-12">
                            <Dropdown
                              value={from.bankId}
                              optionValue="value"
                              optionLabel="label"
                              options={DMBankOptions}
                              label="Tài khoản ngân hàng"
                              className="w-full p-inputtext-sm"
                              onChange={(e: any) => {
                                setFrom({ ...from, bankId: e.value });
                                GetBankFrom(e.value);
                              }}
                            />
                          </div>
                          <div className="col-12">
                            <div className="mt-4">
                              <b>Số tài khoản:</b>
                              {bankFromSelect.account_number}
                            </div>
                            <div className="mt-4">
                              <b>Chủ tài khoản:</b>
                              {bankFromSelect.bank_name}
                            </div>
                            <div className="mt-4">
                              <b>Chi nhánh:</b>
                              {bankFromSelect.branch_name}
                            </div>
                          </div>
                        </div> )}
                        {from.formOfPayment == 1 && (
                          <div className="formgrid grid">
                            <div className="field col-12">
                              <Dropdown
                                value={from.fundId}
                                optionValue="value"
                                optionLabel="label"
                                options={DMQuyOptions}
                                label="Loại quỹ"
                                className="w-full p-inputtext-sm"
                                onChange={(e: any) =>
                                  setFrom({ ...from, fundId: e.value })
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Panel>
                </div>
                <div className="field col-6">
                  <Panel header="Chuyển đến">
                    <div className="grid">
                      <div className="field col-6">
                        <label htmlFor="">Hình thức thanh toán</label>
                        <div className="flex flex-wrap gap-3">
                          {formOfPayment.map((item) => (
                            <div
                              key={item.value}
                              className="flex align-items-center"
                            >
                              <RadioButton
                                inputId={`payment_to_${item.value}`}
                                name="formOfPayment"
                                value={item.value}
                                onChange={(e: any) =>
                                  setTo({ ...to, formOfPayment: e.value })
                                }
                                checked={to.formOfPayment == item.value}
                              />
                              <label
                                htmlFor={`payment_to_${item.value}`}
                                className="ml-2"
                              >
                                {item.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="field col-6">
                         {to.formOfPayment == 2 && (<div className="formgrid grid">
                          <div className="col-12">
                            <Dropdown
                              value={to.bankId}
                              optionValue="value"
                              optionLabel="label"
                              options={DMBankOptions}
                              label="Tài khoản ngân hàng"
                              className="w-full p-inputtext-sm"
                              onChange={(e: any) => {
                                setTo({ ...to, bankId: e.value });
                                GetBankTo(e.value);
                              }}
                            />
                          </div>
                          <div className="col-12">
                            <div className="mt-4">
                              <b>Số tài khoản:</b>
                              {bankToSelect.account_number}
                            </div>
                            <div className="mt-4">
                              <b>Chủ tài khoản:</b>
                              {bankToSelect.bank_name}
                            </div>
                            <div className="mt-4">
                              <b>Chi nhánh:</b>
                              {bankToSelect.branch_name}
                            </div>
                          </div>
                        </div>)}
                        {to.formOfPayment == 1 && (
                          <div className="formgrid grid">
                            <div className="field col-12">
                              <Dropdown
                                value={to.fundId}
                                optionValue="value"
                                optionLabel="label"
                                options={DMQuyOptions}
                                label="Loại quỹ"
                                className="w-full p-inputtext-sm"
                                onChange={(e: any) =>
                                  setTo({ ...to, fundId: e.value })
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Panel>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </AddForm>
    </>
  );
}

