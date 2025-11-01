
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Dropdown, FormInput, InputSwitch, InputTextarea, Panel, RadioButton } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { listToast, scrollToTop, refreshObject, tinhChat } from "utils";
import { updateReceipt, addReceipt, listReceipt, showReceipt } from "../api";
import { useDispatch } from "react-redux";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
export default function UpdateReceiptChi() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({ isExternalDriver: 0 });
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
  useEffect(() => {
    if (id) {
      showReceipt({ id: id, type: CategoryEnum.country }).then(res => {
        const detail = res.data.data
        if (detail) {
          let info = {
            ...detail, status: detail.status === 0 ? true : false,
          };
          setInfos(info)
        }
      }).catch(err => {
        //setHasError(true)
      });
    }
  }, [])
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
                      <InputForm className="w-full"
                      id="fileNumber"
                      value={infos.fileNumber}
                      onChange={(e: any) =>
                        setInfos({ ...infos, fileNumber: e.target.value })
                      }
                      label="Loại quỹ"
                      required
                    />
                  </div>
                  <div className="field col-12">
                    <label htmlFor="">Hình thức thanh toán</label>
                   <div className="flex flex-wrap gap-3">
                      <div className="flex align-items-center">
                          <RadioButton inputId="ingredient1" name="paymentMethod" value="1" onChange={(e: any) => setInfos({ ...infos, paymentMethod: e.value })} checked={infos.paymentMethod === '1'} />
                          <label htmlFor="ingredient1" className="ml-2">Tiền mặt</label>
                      </div>
                      <div className="flex align-items-center">
                          <RadioButton inputId="ingredient2" name="paymentMethod" value="2" onChange={(e: any) => setInfos({ ...infos, paymentMethod: e.value })} checked={infos.paymentMethod === '2'} />
                          <label htmlFor="ingredient2" className="ml-2">Chuyển khoản</label>
                      </div>
                  </div>
                  </div>
                  <div className="field col-6">
                    <Dropdown
                      value={infos.feature}
                      optionValue="feature"
                      optionLabel="name"
                      options={tinhChat}
                      label="Đối tượng"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, feature: e.target.value })
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
                      label="Đối tượng"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, feature: e.target.value })
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
                      label="Số file"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, feature: e.target.value })
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
                        setInfos({ ...infos, feature: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="field col-12">
                    <InputForm
                      id="sales"
                      value={infos.sales}
                      onChange={(e: any) =>
                        setInfos({ ...infos, sales: e.target.value })
                      }
                      className="w-full"
                      label="Người nhận"
                    />
                  </div>
                  <div className="field col-12">
                    <InputForm className="w-full"
                      id="declarationQuantity"
                      type="number"
                      min={1}
                      value={infos.declarationQuantity}
                      onChange={(e: any) => {
                        let v = Number(e.target.value);
                        if (v < 0) v = 1;
                        setInfos({ ...infos, declarationQuantity: v });
                      }}
                      label="Địa chỉ"
                      required
                    />
                  </div>
                  <div className="field col-12">
                    <Dropdown
                      value={infos.feature}
                      optionValue="feature"
                      optionLabel="name"
                      options={tinhChat}
                      label="Lý do chi"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, feature: e.target.value })
                      }
                      required
                    />
                  </div>
                   <div className="field col-4">
                    <InputForm className="w-full"
                      id="note"
                      value={infos.note}
                      onChange={(e: any) =>
                        setInfos({ ...infos, note: e.target.value })
                      }
                      label="Số tiền"
                    />
                  </div>
                  <div className="field col-4">
                   <Dropdown
                      value={infos.feature}
                      optionValue="feature"
                      optionLabel="name"
                      options={tinhChat}
                      label="VAT"
                      className="w-full p-inputtext-sm"
                      onChange={(e: any) =>
                        setInfos({ ...infos, feature: e.target.value })
                      }
                      required
                    />
                  </div>
                   <div className="field col-4">
                    <InputForm className="w-full"
                      id="note"
                      value={infos.note}
                      onChange={(e: any) =>
                        setInfos({ ...infos, note: e.target.value })
                      }
                      label="Thành tiền"
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
                 <div className="formgrid grid">
                    <div className="col-12">
                      <Dropdown
                          className="w-full p-inputtext-sm"
                      />
                    </div>
                    <div className="col-12">
                        <div className="mt-4"><b>Số tài khoản:</b>123423453252</div>
                        <div className="mt-4"><b>Chủ tài khoản:</b>123423453252</div>
                        <div className="mt-4"><b>Chi nhánh:</b>123423453252</div>
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

