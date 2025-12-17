import { useEffect, useMemo, useState } from "react";
import { GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { useGetChuyenTienNoiBoAsync } from "../service";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { FilterMatchMode } from "primereact/api";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { MyCalendar } from "components/common/MyCalendar";
import { Panel } from "components/uiCore";

const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
  const [filter, setFilter] = useState({
    name: "",
    customerDetailId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
  const { data: customerDetails } = useListCustomerDetailWithState({ status: 1});
  // --- chuyển sang options bằng useMemo ---
  const customerOptions = useMemo(() => {
    if (!Array.isArray(customerDetails)) return [];
    return customerDetails.map((x: any) => ({
      label: x?.partners?.abbreviation ?? "(không tên)",
      value: x.id,
    }));
  }, [customerDetails]);
  useEffect(() => {
    // Mỗi khi filter thay đổi => cập nhật params
    _setParamsPaginator((prev: any) => ({
      ...prev,
      keyword: filter.name,
      customerDetailId: filter.customerDetailId,
      fromDate: filter.fromDate,
      toDate: filter.toDate,
    }));
  }, [filter]);

  return (
    <GridForm
      paramsPaginator={_paramsPaginator}
      setParamsPaginator={_setParamsPaginator}
      filter={filter}
      setFilter={setFilter}
      className="lg:col-9"
    >
      <div className="col-2">
        <MyCalendar
          dateFormat="dd/mm/yy"
          value={filter.fromDate}
          onChange={(e: any) => setFilter({ ...filter, fromDate: e })}
          className={classNames("w-full", "p-inputtext", "input-sm")}
        />
      </div>
      <div className="col-2">
        <MyCalendar
          dateFormat="dd/mm/yy"
          value={filter.toDate}
          onChange={(e: any) => setFilter({ ...filter, toDate: e })}
          className={classNames("w-full", "p-inputtext", "input-sm")}
        />
      </div>
    </GridForm>
  );
};

export default function ListBaoCaoLoiNhuan() {
    const { handleParamUrl } = useHandleParamUrl();
    const [displayData, setDisplayData] = useState<any>();
    const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [paramsPaginator, setParamsPaginator] = useState({
        pageNum: 1,
        pageSize: 20,
        first: 0,
        render: false,
        keyword: "",
    });
    const { data, loading, error, refresh } = useGetChuyenTienNoiBoAsync({
        params: {...paramsPaginator},
        debounce: 500,
    });
    const { data: employees } = useListEmployeeWithState({});
    // ✅ Client-side pagination
    useEffect(() => {
        if (!data) return;
        handleParamUrl(paramsPaginator);
        const mapped = (data?.data || []).map((row: any) => {
                        const receipt_a = row.receipts.find((x:any) => x.income_expense_category_id ===26)
                        const receipt_b = row.receipts.find((x:any) => x.income_expense_category_id ===27)
                        const _nguoitao = employees.find((x: any) => x.user_id === row.created_by);
                        return {
                            ...row,
                              price: Helper.formatCurrency(row.price.toString()),
                           code_receipt_a:receipt_a?.code_receipt,  
                           code_receipt_b:receipt_b?.code_receipt,
                          nguoitao: `${_nguoitao?.last_name ?? ""} ${_nguoitao?.first_name ?? ""}`.trim()
                        };
                     });
        setDisplayData(mapped);
    }, [employees,first, rows, data, paramsPaginator]);
    return (
      <div className="card">
        <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
         <Panel header="Thông tin" style={{ height: 'calc(100vh - 8rem)' }}>
                <h3 style={{ textAlign: "center",textTransform: 'uppercase' }}>
                    Báo cáo kết quả kinh doanh
                </h3>
                <div className="field" style={{ textAlign: "center" }}><i>Thời gian: Từ ngày ... Đến ngày ...</i></div> 
                <div className="flex justify-content-center">
                  <div className="col-6">
                    <div className="formgrid grid">
                      <table className="w-full border-1 surface-border border-collapse">
                        <thead>
                           <th className="font-bold" style={{width:"80px"}}>STT</th>
                           <th className="text-center font-bold">Chi tiêu</th>
                           <th className="text-center font-bold">Số tiền</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border-1 surface-border">1</td>
                                <td className="border-1 surface-border">Doanh thu từ các lô hàng có lập file</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>1000000</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">2</td>
                                <td className="border-1 surface-border">Doanh thu từ các lô hàng không lập file</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>1000000</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">3</td>
                                <td className="border-1 surface-border">Chi phi từ các lô hàng có lập file</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>1000000</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">4</td>
                                <td className="border-1 surface-border">Phi vận chuyển mua ngoài không có file</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>1000000</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">5</td>
                                <td className="border-1 surface-border">Phi kinh doanh</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>1000000</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">6</td>
                                <td className="border-1 surface-border">Lợi nhuận trước thuế</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>1000000</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">7</td>
                                <td className="border-1 surface-border">Chi phi thuế TNDN</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>1000000</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">8</td>
                                <td className="border-1 surface-border">Lợi nhuận sau thuế TNDN</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>1000000</td>
                            </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
          </Panel>
      </div>
    );
}