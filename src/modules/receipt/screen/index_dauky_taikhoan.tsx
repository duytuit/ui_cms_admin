import { useEffect, useMemo, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient, DateBody, } from "components/common/DataTable";
import { Dropdown, GridForm, Input, } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { Checkbox } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { TypeDebitDKKH } from "utils";
import { FilterMatchMode } from "primereact/api";
import { useListDebitDauKyKH } from "modules/Debit/service";
import { deleteDebit } from "modules/Debit/api";

// ✅ Component Header lọc dữ liệu
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
      add="/receipt/UpdateDauKyTaiKhoan"
    >
      <div className="col-2">
        <Input
          value={filter.name}
          onChange={(e: any) => setFilter({ ...filter, name: e.target.value })}
          label="Tìm kiếm"
          size="small"
          className={classNames("input-sm")}
        />
      </div>
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
      <div className="col-6">
        <Dropdown
          filter
          showClear
          value={filter.customerDetailId}
          options={customerOptions}
          onChange={(e: any) =>
            setFilter({ ...filter, customerDetailId: e.target.value })
          }
          label="Khách hàng"
          className={classNames("dropdown-input-sm", "p-dropdown-sm")}
        />
      </div>
    </GridForm>
  );
};

export default function ListDauKyTaiKhoan() {
  const { handleParamUrl } = useHandleParamUrl();
   const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      customerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      customerAbb: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      type: { value: null, matchMode: FilterMatchMode.CONTAINS },
      });
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const { data: customers } = useListCustomerDetailWithState({status: 1});
  const { data: employees } = useListEmployeeWithState({});
  const [paramsPaginator, setParamsPaginator] = useState({
    pageNum: 1,
    pageSize: 20,
    first: 0,
    render: false,
    keyword: "",
  });
  const { data, loading, error, refresh } = useListDebitDauKyKH({
    params: paramsPaginator,
    debounce: 500,
  });
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
  // ✅ Client-side pagination
  useEffect(() => {
    if (!data) return;
    handleParamUrl(paramsPaginator);
    const mapped = (data?.data || []).map((row: any) => {
      const cus = customers.find((x: any) => x.id === row.customer_detail_id);
      const _user = employees.find((x: any) => x.user_id === row.updated_by);
      const _type = TypeDebitDKKH.find((x: any) => x.value === row.type);
      return {
        ...row,
        customerName: cus?.partners?.name || "",
        customerAbb: cus?.partners?.abbreviation || "",
        userName: `${_user?.last_name ?? ""} ${_user?.first_name ?? ""}`.trim(),
        type: _type?.name || "",
      };
    });
    setDisplayData(mapped);
  }, [first, rows, data, paramsPaginator, customers]);

  return (
    <>
      <div className="card">
        <Header
          _paramsPaginator={paramsPaginator}
          _setParamsPaginator={setParamsPaginator}
        />

        <DataTableClient
          rowHover
          value={displayData}
          paginator
          rows={rows}
          first={first}
          totalRecords={data?.total}
          currentPageReportTemplate="Tổng số: {totalRecords} bản ghi"
          onPage={(e: any) => {
            setFirst(e.first);
            setRows(e.rows);
          }}
          filters={filters}
          onFilter={(e:any) => setFilters(e.filters)}
          loading={loading}
          dataKey="id"
          title="Tài khoản"
          filterDisplay="row"
          className={classNames("Custom-DataTableClient")}
          scrollable
          tableStyle={{ minWidth: "1600px" }} // ép bảng rộng hơn để có scroll ngang
        >
          {/* Custom checkbox column */}
          <Column
            header={
              <Checkbox
                checked={
                  selectedRows.length === displayData.length &&
                  displayData.length > 0
                }
                onChange={(e: any) => {
                  if (e.checked) setSelectedRows(displayData.map((d) => d.id));
                  else setSelectedRows([]);
                }}
              />
            }
            body={(rowData: any) => (
              <Checkbox
                className="p-checkbox-sm"
                checked={selectedRows.includes(rowData.id)}
                onChange={(e: any) => {
                  if (e.checked)
                    setSelectedRows((prev) => [...prev, rowData.id]);
                  else
                    setSelectedRows((prev) =>
                      prev.filter((id) => id !== rowData.id)
                    );
                }}
                onClick={(e: any) => e.stopPropagation()} // ⚡ chặn row click
              />
            )}
            style={{ width: "3em" }}
          />
          <Column header="Thao tác" 
           body={(row: any) => {
              return ActionBody(
                    row,
                    "/debit/detailDauKyKh",
                    { route: "/debit/delete", action: deleteDebit },
                    paramsPaginator,
                    setParamsPaginator
                );
            }}
           style={{ width: "6em" }} 
          />
          <Column field="accounting_date" header="Ngày hạch toán" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="type" header="Loại dịch vụ" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="price"   
           body={(row: any) => Helper.formatCurrency(row.price.toString())}
            footer={getSumColumn("price")}
            footerStyle={{ fontWeight: "bold" }}
           header="Số tiền" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="name" header="Ghi chú" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="userName" header="Người thực hiện" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />

        </DataTableClient>
      </div>
    </>
  );
}
