
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button, FormInput, InputSwitch, InputTextarea, Panel, RadioButton } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { listToast, scrollToTop, refreshObject, tinhChat, TypeDoiTuong, typeDebit, VatDebit } from "utils";
import { updateReceipt, addReceipt, listReceipt, showReceipt } from "../api";
import { useDispatch } from "react-redux";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { Dropdown, Input } from "components/common/ListForm";
import { useListEmployee } from "modules/employee/service";
import { useListPartnerDetail } from "modules/partner/service";
import { useListBankWithState, useListFundCategoryWithState, useListIncomeExpenseWithState, useListServiceCategoryWithState } from "modules/categories/service";
import { useListContractFileWithState } from "modules/ContractFile/service";
export default function UpdateReceiptChi() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [doiTuongOptions, setDoiTuongOptions] = useState<any>([]);
  const [employeeInfo, setEmployeeInfo] = useState<any>({});
  const [bankSelect, setBankSelect] = useState<any>({});
  const [infos, setInfos] = useState<any>({vat:0,type_doi_tuong:0, isExternalDriver: 0,accountingDate:Helper.toDayString(),paymentMethod:1 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    let info = {
      ...infos, status: infos.status ? 0 : 1,
    };
    console.log('info', info);

    setLoading(true);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
    if (info.id) {
      const response = await updateReceipt(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          navigate('/Receipt/list');
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    } else {
      const response = await addReceipt(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          setInfos({ ...refreshObject(infos), status: true })
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          navigate('/Receipt/list');
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    }
  };
   const { data: ContractFile } = useListContractFileWithState({});
   const ContractFileptions = useMemo(() => {
       if (!Array.isArray(ContractFile)) return [];
       return ContractFile.map((x: any) => ({
         label: x?.fileNumber ?? "(không tên)",
         value: x.id,
       }));
     }, [ContractFile]);
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
   const { data: employees } = useListEmployee({
     params: { keyword: "abc" },
     debounce: 500,
   });
   // lấy ra nhân viên giao nhận
   const nhanviengiaonhanOptions = useMemo(() => {
     if (!Array.isArray(employees?.data)) return [];

     return employees.data
       .filter(
         (x: any) =>
           Array.isArray(x.employee_departments) &&
           x.employee_departments[0]?.department_id === 3
       )
       .map((x: any, index: number) => ({
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

  useEffect(() => {
    if (id) {
      showReceipt({ id: id, type: CategoryEnum.country }).then(res => {
        const detail = res.data.data
        if (detail) {
          let info = {
            ...detail, status: detail.status === 0 ? true : false,
          };
          setInfos(info)
          // set doiTuongOptions according to returned type_doi_tuong
       
        }
      }).catch(err => {
        //setHasError(true)
      });
    }
      // initialize with default mapped partner options
      setDoiTuongOptions(partnerOptions)
      const employeeInfo = localStorage.getItem('employeeInfo') ? JSON.parse(localStorage.getItem('employeeInfo') || '{}') : null;
      setEmployeeInfo(employeeInfo);
      console.log(employeeInfo);
      
    }, [ContractFileptions,DMQuyOptions,DMBankOptions,partnerOptions, partnerVenderOptions, nhanviengiaonhanOptions, id])
  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title="phiếu chi"
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/receipt/listReceiptChi"
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
                      <Dropdown
                      value={infos.loai_quy}
                      optionValue="value"
                      optionLabel="label"
                      options={DMQuyOptions}
                      label="Loại quỹ"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, loai_quy: e.value })
                      }
                      required
                    />
                  </div>
                  <div className="field col-12">
                    <label htmlFor="">Hình thức thanh toán</label>
                   <div className="flex flex-wrap gap-3">
                      <div className="flex align-items-center">
                          <RadioButton inputId="ingredient1" name="paymentMethod" value="1" onChange={(e: any) => setInfos({ ...infos, paymentMethod: e.value })} checked={infos.paymentMethod == 1} />
                          <label htmlFor="ingredient1" className="ml-2">Tiền mặt</label>
                      </div>
                      <div className="flex align-items-center">
                          <RadioButton inputId="ingredient2" name="paymentMethod" value="2" onChange={(e: any) => setInfos({ ...infos, paymentMethod: e.value })} checked={infos.paymentMethod == 2} />
                          <label htmlFor="ingredient2" className="ml-2">Chuyển khoản</label>
                      </div>
                  </div>
                  </div>
                  <div className="field col-6">
                    <Dropdown
                      value={infos.type_doi_tuong}
                      optionValue="value"
                      optionLabel="name"
                      options={TypeDoiTuong}
                      label="Đối tượng"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        {
                          const v = e.value;
                          // reset dependent selected id when type changes
                          setInfos({ ...infos, type_doi_tuong: v, ma_doi_tuong: undefined })
                          if(v === 0){
                            setDoiTuongOptions(partnerOptions)
                          }else if(v === 1){
                            setDoiTuongOptions(partnerVenderOptions)
                          }else{
                            setDoiTuongOptions(nhanviengiaonhanOptions)
                          }
                        }
                      }
                      required
                    />
                  </div>
                  <div className="field col-6">
                     <Dropdown
                      value={infos.ma_doi_tuong}
                      optionValue="value"
                      optionLabel="label"
                      options={doiTuongOptions}
                      label="Đối tượng"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, ma_doi_tuong: e.value })
                      }
                      required
                    />
                  </div>
                  <div className="field col-6">
                    <Dropdown
                      filter
                      value={infos.file_number}
                      optionValue="value"
                      optionLabel="label"
                      options={ContractFileptions}
                      label="Số file"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, file_number: e.value })
                      }
                      required
                    />
                  </div>
                  <div className="field col-6">
                    <Dropdown
                      value={infos.feature}
                      optionValue="feature"
                      optionLabel="name"
                      options={tinhChat}
                      label="Người giao nhận"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, feature: e.value })
                      }
                      required
                    />
                  </div>
                  <div className="field col-12">
                    <Input
                      id="sales"
                      value={employeeInfo ? `${employeeInfo.lastName ?? ''} ${employeeInfo.firstName ?? ''}`.trim() : ''}
                      onChange={(e: any) =>
                        setInfos({ ...infos, sales: e.target.value })
                      }
                      className="w-full"
                      label="Người nhận"
                      disabled
                    />
                  </div>
                  <div className="field col-12">
                    <InputForm className="w-full"
                      id="declarationQuantity"
                      value={infos.declarationQuantity}
                      onChange={(e: any) => {
                        setInfos({ ...infos, declarationQuantity: e.value });
                      }}
                      label="Địa chỉ"
                      required
                    />
                  </div>
                  <div className="field col-12">
                     <InputForm className="w-full"
                      id="lydochi"
                      value={infos.note}
                      onChange={(e: any) =>
                        setInfos({ ...infos, lydochi: e.target.value })
                      }
                      label="Lý do chi"
                    />
                  </div>
                   <div className="field col-4">
                    <InputForm className="w-full"
                      id="sotien"
                      value={infos.sotien}
                      onChange={(e: any) =>
                         {
                           setInfos({ ...infos, sotien: Helper.formatCurrency(e.target.value )})
                           const thanhtien  = parseInt(e.target.value.replace(/\D/g, ""),10) + ( infos.vat ? ( parseInt(e.target.value.replace(/\D/g, ""),10) * infos.vat ) / 100 : 0  );
                           setInfos({ ...infos, sotien: Helper.formatCurrency(e.target.value ), thanhtien : Helper.formatCurrency(thanhtien.toString()) })
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
                             const thanhtien  = parseInt( infos.sotien.replace(/\D/g, ""),10) + ( e.value ? ( parseInt( infos.sotien.replace(/\D/g, ""),10) * e.value ) / 100 : 0  );
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
                      id="note"
                      value={infos.note}
                      onChange={(e: any) =>
                        setInfos({ ...infos, note: e.target.value })
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
                 { infos.paymentMethod == 2 && <div className="formgrid grid">
                    <div className="col-12">
                      <Dropdown
                      value={infos.bank_id}
                      optionValue="value"
                      optionLabel="label"
                      options={DMBankOptions}
                      label="Tài khoản ngân hàng"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        {
                          setInfos({ ...infos, bank_id: e.value })
                          const selected = DMBank.find((x: any) => x.id === e.value);
                          setBankSelect(selected || {});
                        }
                      }
                      required
                    />
                    </div>
                    <div className="col-12">
                        <div className="mt-4"><b>Số tài khoản:</b>{bankSelect.account_number}</div>
                        <div className="mt-4"><b>Chủ tài khoản:</b>{bankSelect.bank_name}</div>
                        <div className="mt-4"><b>Chi nhánh:</b>{bankSelect.branch_name}</div>
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

