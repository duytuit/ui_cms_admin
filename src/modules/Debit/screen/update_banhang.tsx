
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Panel } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { useDispatch } from "react-redux";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { Dropdown } from "components/common/ListForm";
import { useListPartnerDetail } from "modules/partner/service";
import { listToast, refreshObject, VatDebit } from "utils";
import { showWithDebit } from "modules/receipt/api";
import { addDebitBanHangKH, showDebit, updateDebitBanHangKH } from "../api";
export default function UpdateBanHang() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({vat:0,typeDoiTuong:0,accountingDate:Helper.toDayString(),formOfPayment:1 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
         const response = await updateDebitBanHangKH(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/debit/ListBanHang");
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
       const response = await addDebitBanHangKH(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/debit/ListBanHang");
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
        showDebit({ id: id }).then(res => {
          const detail = res.data.data
          if (detail) {
             const thanhtien = Math.round(detail.price * (1 + detail.vat / 100));
               detail.price = Helper.formatCurrency(detail.price.toString())
            let info = {
              ...detail, status: detail.status === 0 ? true : false,thanhtien:Helper.formatCurrency(thanhtien.toString())
            };
            setInfos(info)
            // set doiTuongOptions according to returned typeDoiTuong
          }
        }).catch(err => {
          //setHasError(true)
        });
      }
      // initialize with default mapped partner options
    }, [partnerOptions, partnerVenderOptions, id])
  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title="Bán hàng"
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/debit/ListBanHang"
      >
        <div className="field">
          <Panel header="Thông tin">
            <div className="grid">
              <div className="col-12">
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
                     filter
                      value={infos.customerDetailId}
                      optionValue="value"
                      optionLabel="label"
                      options={partnerOptions}
                      label="Khách hàng"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, customerDetailId: e.value })
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
                            const priceStr = String(infos.price ?? "");
                            const numeric = parseInt(priceStr.replace(/\D/g, ""), 10);
                             setInfos({ ...infos, vat: e.value })
                             const thanhtien  = numeric + ( e.value ? ( numeric * e.value ) / 100 : 0  );
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
                      label="Diễn giải"
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

