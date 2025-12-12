
import { InputForm, UpdateForm } from "components/common/AddForm";
import { useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject} from "utils";
import { useDispatch } from "react-redux";
import { updateBillCustomerFileNoFile } from "../api";
import { Panel } from "components/uiCore";
import { Helper } from "utils/helper";
import { MyCalendar } from "components/common/MyCalendar";
import { classNames } from "primereact/utils";
export default function UpdateXuatHoaDonNCC({ ids, onClose }: { ids: any; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({supBillDate:Helper.toDayString() });
  const dispatch = useDispatch();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    infos.ids = ids;
    console.log('info', infos);
    setLoading(true);
    fetchDataSubmit(infos);
  };
  async function fetchDataSubmit(info: any) {
      const response = await updateBillCustomerFileNoFile(info);
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
  return (
    <>
       <UpdateForm
            className="w-full"
            style={{ margin: "0 auto" }}
            checkId={infos.id}
            title="Thông tin xuất hóa đơn"
            loading={loading}
            onSubmit={handleSubmit}
            route={Number(infos.id) ? "/debit/update" : "/debit/create"}
            AddName="Lưu"
        >
           <div className="field">
                <Panel header="Thông tin"  style={{ height: '300px' }}>
                      <div className="flex justify-content-center">
                        <div style={{ backgroundColor: "#f8f9fa" }} className="card col-12">
                            <div className="field grid">
                              <label
                                htmlFor="code"
                                className="col-12 mb-2 md:col-3 md:mb-0"
                              >
                                Ngày xuất hóa đơn
                              </label>
                              <div className="col-12 md:col-9">
                                 <MyCalendar dateFormat="dd/mm/yy"
                                    value={Helper.formatDMYLocal(infos.supBillDate ? infos.supBillDate : '')} // truyền nguyên ISO string
                                    onChange={(e: any) =>
                                      setInfos({ ...infos, supBillDate: e })}
                                    className={classNames("w-full", "p-inputtext", "input-form-sm")} 
                                  />
                              </div>
                            </div>
                            <div className="field grid">
                                <label
                                  htmlFor="bill"
                                  className="col-12 mb-3 md:col-3 md:mb-0"
                                >
                                  Số hóa đơn
                                </label>
                                <div className="col-12 md:col-9">
                                  <InputForm className="w-full"
                                    id="SupBill"
                                    value={infos.SupBill}
                                    onChange={(e: any) =>
                                      setInfos({ ...infos, SupBill: e.target.value })
                                    }
                                    label="Số hóa đơn"
                                  />
                                </div>
                            </div>
                      </div>
                </div>
              </Panel>
           </div>
        </UpdateForm>
    </>
  );
}