import { useEffect, useMemo, useState } from "react";
import { Column, TimeBody, DataTableClient, DateBody, ActionBody } from "components/common/DataTable";
import { GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { useGetChuyenTienNoiBoAsync } from "../service";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { FilterMatchMode } from "primereact/api";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { MyCalendar } from "components/common/MyCalendar";
import { deleteChuyentiennoibo } from "../api";

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
      add="/receipt/UpdateChuyenTienNoiBo"
      addName="Chuyển tiền nội bộ"
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

export default function ListChuyenTienNoiBo() {
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
        params: {...paramsPaginator,type:0},
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
    const getSumColumn = (field: string) => {
        const filtered = (displayData??[]).filter((item: any) => {
            return Object.entries(filters).every(([key, f]: [string, any]) => {
                const value = f?.value?.toString().toLowerCase() ?? "";
                if (!value) return true;
                const cell = item[key]?.toString().toLowerCase() ?? "";
                return cell.includes(value);
            });
        });

        const sum = filtered.reduce((acc: any, item: any) => {
            const val = parseInt(item[field]?.toString().replace(/\D/g, ""), 10) || 0;
            return acc + val;
        }, 0);

        return Helper.formatCurrency(sum.toString());
    };
    return (
          <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
             <DataTableClient
                    rowHover
                    value={displayData}
                    paginator
                    rows={rows}
                    first={first}
                    totalRecords={data?.total}
                    filters={filters}
                    onFilter={(e:any) => setFilters(e.filters)}
                    currentPageReportTemplate="Tổng số: {totalRecords} bản ghi"
                    onPage={(e: any) => {
                      setFirst(e.first);
                      setRows(e.rows);
                    }}
                    loading={loading}
                    dataKey="id"
                    title="Tài khoản"
                    filterDisplay="row"
                    className={classNames("Custom-DataTableClient")}
                    scrollable
                    tableStyle={{ minWidth: "1000px" }} // ép bảng rộng hơn để có scroll ngang
                >
                    <Column
                    header="Thao tác"
                    body={(row: any) => {
                       return ActionBody(
                              row,
                              "/receipt/chuyentiennoibo/detail",
                              { route: "/receipt/chuyentiennoibo/delete", action: deleteChuyentiennoibo },
                              paramsPaginator,
                              setParamsPaginator
                          );
                        }}
                    />
                     <Column
                        field="accounting_date"
                        header="Ngày chứng từ"
                        body={(e: any) => DateBody(e.accounting_date)}
                        filter
                        showFilterMenu={false}
                        filterMatchMode="contains"
                    />
                    <Column field="code_receipt_a" header="Phiếu chuyển từ" filter showFilterMenu={false}  filterMatchMode="contains"/>
                    <Column field="code_receipt_b" header="Phiếu chuyển đến" filter showFilterMenu={false}  filterMatchMode="contains"/>
                    <Column field="price" header="Số tiền" filter showFilterMenu={false}  filterMatchMode="contains"
                        footer={getSumColumn("price")}
                        footerStyle={{ fontWeight: "bold" }}
                    />
                    <Column field="note" header="Ghi chú" />
                    <Column field="nguoitao" header="Người cập nhật" filter showFilterMenu={false}  filterMatchMode="contains"/>
                    <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                </DataTableClient>
          </div>
    );
}