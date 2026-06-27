
import { InputForm, UpdateForm } from "components/common/AddForm";
import { useEffect, useMemo, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject, typeDepreciation} from "utils";
import { useDispatch } from "react-redux";
import { Dropdown, Input } from "components/common/ListForm";
import { Panel } from "components/uiCore";
import { Helper } from "utils/helper";
import { updateDepreciationAllocation } from "modules/Depreciation/api";
export default function UpdatePhanBoKhauHao({ type, onClose }: {  type: number, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [dataCycleName, setDataCycleName] = useState<any[]>([]);
 const [infos, setInfos] = useState<any>({
  accountingDate:Helper.getLastDayOfCycleYMD(Helper.getCurrentMonthCycle()),
  note: `Khấu hao ${typeDepreciation.find((t: any) => t.type === type || '')?.name} kỳ ${Helper.getCurrentMonthCycle()}`,
  cycleName: Helper.getCurrentMonthCycle(),
  type: type,
  expiryDate:  Helper.getLastDayOfCycleDMY(Helper.getCurrentMonthCycle()),
});
  const dispatch = useDispatch();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    fetchDataSubmit(infos);
  };
  async function fetchDataSubmit(info: any) {
      const response = await updateDepreciationAllocation(info);
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
                <Panel header="Thông tin">
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
                                        const note = `Khấu hao ${typeDepreciation.find((t: any) => t.type === type || '')?.name} kỳ ${e.target.value}`; 
                                        const accountingDate = Helper.getLastDayOfCycleYMD(e.target.value);
                                        setInfos({ ...infos, cycleName: e.target.value, note, accountingDate, expiryDate: Helper.getLastDayOfCycleDMY(e.target.value) })
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
                                 {/* <MyCalendar dateFormat="dd/mm/yy"
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
                                  /> */}
                                  <label className="p-inputtext-sm">{infos.expiryDate}</label>
                              </div>
                            </div>
                             <div className="field grid">
                                <div className="col-12">
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
                </div>
              </Panel>
           </div>
        </UpdateForm>
    </>
  );
}