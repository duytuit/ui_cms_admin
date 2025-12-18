import { useEffect, useMemo, useState } from "react";
import { GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { useGetObjectBaoCaoDoanhThuAsync } from "../service";
import { Helper } from "utils/helper";
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
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [paramsPaginator, setParamsPaginator] = useState({
        pageNum: 1,
        pageSize: 20,
        first: 0,
        render: false,
        keyword: "",
    });
    const { data, loading, error, refresh } = useGetObjectBaoCaoDoanhThuAsync({
        params: {...paramsPaginator},
        debounce: 500,
    });
    // ✅ Client-side pagination
    useEffect(() => {
         if (!data?.extra) return;

          handleParamUrl(paramsPaginator);

          const extra = data.extra;

          const roundMoney = (v?: number) => Math.round(v ?? 0);

          const dt_hasfile_results =
            roundMoney(extra.dt_hasfile_results?.[0]?.total_price);

          const dt_nofile_results =
            roundMoney(extra.dt_nofile_results?.[0]?.total_price);

          const cp_hasfile_results =
            roundMoney(extra.cp_hasfile_results?.[0]?.total_purchase_price);

          const cp_nofile_results =
            roundMoney(extra.cp_nofile_results?.[0]?.total_purchase_price);

          const cp_kinhdoanh =
            roundMoney(extra.cp_kinhdoanh?.[0]?.amount);

          const doanhthu_khac =
            roundMoney(extra.doanhthu_khac?.[0]?.amount);

          const loinhuantruocthue = roundMoney(
            dt_hasfile_results +
            dt_nofile_results +
            doanhthu_khac -
            cp_hasfile_results -
            cp_nofile_results -
            cp_kinhdoanh
          );

          const chiphithueTNDN = roundMoney(
            loinhuantruocthue > 0 ? loinhuantruocthue * 0.2 : 0
          );

          const loinhuansauthue = roundMoney(
            loinhuantruocthue - chiphithueTNDN
          );

          setDisplayData({
            dt_hasfile_results,
            dt_nofile_results,
            cp_hasfile_results,
            cp_nofile_results,
            cp_kinhdoanh,
            doanhthu_khac,
            loinhuantruocthue,
            chiphithueTNDN,
            loinhuansauthue,
          });
        
    }, [first, rows, data, paramsPaginator]);
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
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dt_hasfile_results.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">2</td>
                                <td className="border-1 surface-border">Doanh thu từ các lô hàng không lập file</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.dt_nofile_results.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">3</td>
                                <td className="border-1 surface-border">Doanh thu khác</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.doanhthu_khac.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">3</td>
                                <td className="border-1 surface-border">Chi phi từ các lô hàng có lập file</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.cp_hasfile_results.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">4</td>
                                <td className="border-1 surface-border">Phi vận chuyển mua ngoài không có file</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.cp_nofile_results.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">5</td>
                                <td className="border-1 surface-border">Phi kinh doanh</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.cp_kinhdoanh.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">6</td>
                                <td className="border-1 surface-border">Lợi nhuận trước thuế</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.loinhuantruocthue.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">7</td>
                                <td className="border-1 surface-border">Chi phi thuế TNDN</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.chiphithueTNDN.toString())}</td>
                            </tr>
                            <tr>
                                <td className="border-1 surface-border">8</td>
                                <td className="border-1 surface-border">Lợi nhuận sau thuế TNDN</td>
                                <td className="border-1 surface-border" style={{ textAlign: 'right' }}>{Helper.formatCurrency(displayData?.loinhuansauthue.toString())}</td>
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