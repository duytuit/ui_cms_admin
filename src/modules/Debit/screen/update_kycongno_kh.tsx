
import { InputForm, UpdateForm } from "components/common/AddForm";
import { useEffect, useMemo, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject} from "utils";
import { useDispatch } from "react-redux";
import { updateBillCustomerFileGia } from "../api";
import { Dropdown, Input } from "components/common/ListForm";
import { Panel } from "components/uiCore";
import { Helper } from "utils/helper";
import { MyCalendar } from "components/common/MyCalendar";
import { classNames } from "primereact/utils";
import { addBill } from "modules/bill/api";
export default function UpdateKyCongNoKH({ ids,cycleName,customerCreditLimitMonth,customerDetailId, onClose }: { ids: any, cycleName: any,customerCreditLimitMonth :any,customerDetailId:any, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [dataCycleName, setDataCycleName] = useState<any[]>([]);
  const [infos, setInfos] = useState<any>({accountingDate:Helper.toDayString() });
  const dispatch = useDispatch();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    infos.ids = ids;
    infos.expiryDate = Helper.formatYMDLocal(infos.expiryDate);
    infos.customerDetailId =customerDetailId;
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
  const excludedCycles = cycleName ?? [];
  const monthlyCycles = Helper.getMonthlyCycles();

  const cycles =
    excludedCycles.length > 0
      ? monthlyCycles.filter(cycle => !excludedCycles.includes(cycle))
      : monthlyCycles;

  setDataCycleName(cycles);

  if (infos.cycleName) return;

  let selectedCycle = Helper.getCurrentMonthCycle();

  // 🔥 nếu tháng hiện tại bị exclude → tìm tháng kế tiếp hợp lệ
  while (excludedCycles.includes(selectedCycle)) {
    selectedCycle = Helper.getNextMonthCycle(selectedCycle);

    // tránh loop vô hạn
    if (!monthlyCycles.includes(selectedCycle)) break;
  }
  const expiryDate = new Date(infos.accountingDate);
          expiryDate.setDate(expiryDate.getDate() + customerCreditLimitMonth);
          setInfos({
            ...infos,
            expiryDate,
          });
  if (cycles.includes(selectedCycle)) {
    setInfos((prev: any) => ({
      ...prev,
      cycleName: selectedCycle,
    }));
  }
 
}, [cycleName]);
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
                                Kỳ công nợ
                              </label>
                              <div className="col-12 md:col-9">
                                 <Dropdown
                                    value={infos.cycleName}
                                    options={cycleOptions}
                                    label="Kỳ công nợ"
                                    className="p-inputtext-sm"
                                    onChange={(e: any) =>
                                      setInfos({ ...infos, cycleName: e.target.value })
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
                                Ngày hạch toán
                              </label>
                              <div className="col-12 md:col-9">
                                 <MyCalendar dateFormat="dd/mm/yy"
                                    value={Helper.formatDMYLocal(infos.accountingDate ? infos.accountingDate : '')} // truyền nguyên ISO string
                                    onChange={(e: any) => {
                                      const accountingDate = e;
                                      const expiryDate = new Date(accountingDate);
                                      expiryDate.setDate(expiryDate.getDate() + customerCreditLimitMonth);
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
                              <label
                                htmlFor="code"
                                className="col-12 mb-2 md:col-3 md:mb-0"
                              >
                                Hạn thanh toán
                              </label>
                              <div className="col-12 md:col-9">
                                {infos.expiryDate ? Helper.formatDMY(infos.expiryDate): ""}
                              </div>
                            </div>
                             <div className="field grid">
                                <label
                                  htmlFor="bill"
                                  className="col-12 mb-3 md:col-3 md:mb-0"
                                >
                                  Ghi chú
                                </label>
                                <div className="col-12 md:col-9">
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
                </div>
              </Panel>
           </div>
        </UpdateForm>
    </>
  );
}