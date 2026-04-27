
import { InputForm, UpdateForm } from "components/common/AddForm";
import { useEffect, useMemo, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject} from "utils";
import { useDispatch } from "react-redux";
import { Dropdown, Input } from "components/common/ListForm";
import { Panel } from "components/uiCore";
import { Helper } from "utils/helper";
import { MyCalendar } from "components/common/MyCalendar";
import { classNames } from "primereact/utils";
import { addBill } from "modules/bill/api";
export default function UpdatePhanBoKhauHao({ displayData, onClose }: {  displayData: any, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [dataCycleName, setDataCycleName] = useState<any[]>([]);
 const [infos, setInfos] = useState<any>({
  accountingDate: Helper.toDayString(),
  expiryDate: null,
  note: "",
  cycleName: null,
});
  const dispatch = useDispatch();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // if (debit_ids.length === 0 && type == 1) {
    //   dispatch(showToast({ ...listToast[2], detail: "Chưa có chi tiết công nợ" }));
    //   return;
    // }
    // infos.id = type == 1 ? 0 : bill.id;
    // infos.DebitIds = debit_ids;
    // infos.expiryDate = Helper.formatYMDLocal(infos.expiryDate);
    // infos.customerDetailId = customerSelect?.customer_detail_id;
    console.log('info', infos);
    setLoading(true);
    fetchDataSubmit(infos);
  };
  async function fetchDataSubmit(info: any) {
      const response = await addBill(info);
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
  const cycleOptions = useMemo(() => {
  return dataCycleName.map(cycle => ({
    label: `Tháng ${cycle.slice(0, 2)}/${cycle.slice(2)}`,
    value: cycle,
  }));
}, [dataCycleName]);
useEffect(() => {
  const monthlyCycles = Helper.getMonthlyCycles();
  setDataCycleName(monthlyCycles);

  const accountingDate = infos.accountingDate ?? Helper.toDayString();
  const expiryDate = new Date(accountingDate);


  setInfos((prev:any) => ({
    ...prev,
    cycleName: Helper.getCurrentMonthCycle(),
    expiryDate,
  }));
}, []);

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
                <Panel header="Thông tin"  style={{ height: '400px' }}>
                      <div className="flex justify-content-center">
                        <div style={{ backgroundColor: "#f8f9fa" }} className="card col-12">
                            <div className="field grid">
                              <label
                                htmlFor="code"
                                className="col-12 mb-2 md:col-3 md:mb-0"
                              >
                                Kỳ phân bổ khấu hao
                              </label>
                              <div className="col-12 md:col-9">
                                 <Dropdown
                                    value={infos.cycleName}
                                    options={cycleOptions}
                                    label="Kỳ phân bổ khấu hao"
                                    className="p-inputtext-sm"
                                    onChange={(e: any) =>
                                     {
                                        console.log( e.target.value);
                                        setInfos({ ...infos, cycleName: e.target.value })
                                     }
                                    }
                                    required
                                  />
                              </div>
                            </div>
                            <div className="field grid">
                              <label
                                htmlFor="code"
                                className="col-12 mb-2 md:col-3 md:mb-0"
                              >
                                Ngày lập
                              </label>
                              <div className="col-12 md:col-9">
                                 <MyCalendar dateFormat="dd/mm/yy"
                                    value={Helper.formatDMYLocal(infos.accountingDate ? infos.accountingDate : '')} // truyền nguyên ISO string
                                    onChange={(e: any) => {
                                      const accountingDate = e;
                                      const expiryDate = new Date(accountingDate);
                                      setInfos({
                                        ...infos,
                                        accountingDate,
                                        expiryDate
                                      });
                                      
                                    }}
                                    className={classNames("w-full", "p-inputtext", "input-form-sm")} 
                                  />
                              </div>
                            </div>
                             <div className="field grid">
                                <div className="col-12">
                                  <InputForm className="w-full"
                                    id="name"
                                    value={infos.name}
                                    onChange={(e: any) =>
                                      setInfos({ ...infos, name: e.target.value })
                                    }
                                    label="Diễn giải"
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