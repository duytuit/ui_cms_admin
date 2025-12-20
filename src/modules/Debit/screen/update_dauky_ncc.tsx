
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Panel } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { useDispatch } from "react-redux";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { Dropdown, Input } from "components/common/ListForm";
import { useListPartnerDetail } from "modules/partner/service";
import { listToast, refreshObject, TypeDebitDKNCC } from "utils";
import { addDebitDauKyKH, addDebitDauKyNCC, showDebit, updateDebitDauKyNCC } from "../api";
export default function UpdateDauKyNCC() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({vat:0,type_doi_tuong:0,accountingDate:Helper.toDayString(),formOfPayment:1,type:10 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: supplierDetails } = useListPartnerDetail({ params: { status: 2 }, debounce: 500 });
  const supplierOptions = useMemo(() => {
    if (!Array.isArray(supplierDetails?.data)) return [];
    return supplierDetails.data.map((x: any) => ({
      label: x?.partners?.abbreviation ?? "(không tên)",
      value: x.id,
    }));
  }, [supplierDetails]);
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
  async function fetchDataSubmit(info: any) {
   
     if (info.id) {
         const response = await updateDebitDauKyNCC(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/debit/ListDauKyNcc");
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
       const response = await addDebitDauKyNCC(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/debit/ListDauKyNcc");
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
      
    }, [supplierDetails,id])
  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title="đầu kỳ nhà cung cấp"
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/debit/ListDauKyNcc"
      >
        <div className="field">
          <Panel header="Thông tin">
            <div className="grid">
              <div className="col-12">
                <div className="formgrid grid">
                  <div className="field col-12">
                    <Dropdown
                      filter
                      value={infos.supplierDetailId}
                      options={supplierOptions}
                      onChange={(e: any) =>
                        setInfos({ ...infos, supplierDetailId: e.target.value })
                      }
                      label="Nhà cung cấp"
                      className="w-full"
                      disabled={id ? true : false}
                      required
                    />
                  </div>
                  <div className="field col-3">
                    <MyCalendar dateFormat="dd/mm/yy"
                      value={Helper.formatDMYLocal(infos.accountingDate ? infos.accountingDate : '')} // truyền nguyên ISO string
                      onChange={(e: any) =>
                      setInfos({ ...infos, accountingDate: e })}
                      className={classNames("w-full", "p-inputtext", "input-form-sm")} />
                  </div>
                  <div className="field col-3">
                    <Dropdown
                      value={infos.type}
                      optionValue="value"
                      optionLabel="name"
                      options={TypeDebitDKNCC}
                      label="Loại dịch vụ"
                      className="p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, type: e.target.value })
                      }
                      required
                    />
                   </div>
                   <div className="field col-3">
                    <InputForm className="w-full"
                      id="price"
                      value={infos.price}
                      onChange={(e: any) =>
                         {
                           setInfos({ ...infos, price: Helper.formatCurrency(e.target.value )})
                         }
                      }
                      label="Số tiền"
                      required
                    />
                  </div>
                   <div className="field col-3">
                    <InputForm className="w-full"
                      id="name"
                      value={infos.name}
                      onChange={(e: any) =>
                        setInfos({ ...infos, name: e.target.value })
                      }
                      label="Ghi chú"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </AddForm>
    </>
  );
}

