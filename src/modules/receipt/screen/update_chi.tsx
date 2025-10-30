
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Dropdown, FormInput, InputSwitch, InputTextarea, Panel } from "components/uiCore";
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
            <div className="formgrid grid">
              <div className="field col-12">
                <InputForm className="w-full"
                  id="fileNumber"
                  value={infos.fileNumber}
                  onChange={(e: any) =>
                    setInfos({ ...infos, fileNumber: e.target.value })
                  }
                  label="Số file"
                  required
                />
              </div>
              <div className="field col-2">
                <MyCalendar dateFormat="dd/mm/yy"
                  value={Helper.formatDMYLocal(infos.accountingDate ? infos.accountingDate : '')} // truyền nguyên ISO string
                  onChange={(e: any) =>
                    setInfos({ ...infos, accountingDate: e })}
                  className={classNames("w-full", "p-inputtext", "input-form-sm")} />
              </div>
              <div className="field col-2">
                <InputForm className="w-full"
                  id="declaration"
                  value={infos.declaration}
                  onChange={(e: any) =>
                    setInfos({ ...infos, declaration: e.target.value })
                  }
                  label="Số tờ khai"
                  required
                />
              </div>
              <div className="field col-2">
                <Dropdown
                  value={infos.feature}
                  optionValue="feature"
                  optionLabel="name"
                  options={tinhChat}
                  label="Chọn tính chất"
                  className="p-inputtext-sm"
                  onChange={(e: any) =>
                    setInfos({ ...infos, feature: e.target.value })
                  }
                  required
                />
              </div>
              <div className="field col-2">
                <InputForm className="w-full"
                  id="bill"
                  value={infos.bill}
                  onChange={(e: any) =>
                    setInfos({ ...infos, bill: e.target.value })
                  }
                  label="Số bill"
                  required
                />
              </div>
              <div className="field col-2">
                <InputForm className="w-full"
                  id="quantity"
                  value={infos.quantity}
                  onChange={(e: any) =>
                    setInfos({ ...infos, quantity: e.target.value })
                  }
                  label="Số lượng"
                  required
                />
              </div>
              <div className="field col-2">
                <InputForm className="w-full"
                  id="containerCode"
                  value={infos.containerCode}
                  onChange={(e: any) =>
                    setInfos({ ...infos, containerCode: e.target.value })
                  }
                  label="Số cont"
                />
              </div>
              <div className="field col-2">
                <InputForm
                  id="sales"
                  value={infos.sales}
                  onChange={(e: any) =>
                    setInfos({ ...infos, sales: e.target.value })
                  }
                  className="w-full"
                  label="Tên sales"
                />
              </div>
              <div className="field col-2">
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
                  label="Số lượng tờ khai"
                  required
                />
              </div>
              <div className="field col-12">
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
          </Panel>
        </div>
      </AddForm>
    </>
  );
}

