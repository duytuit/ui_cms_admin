import { useEffect, useMemo, useRef, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, DataTableClient, DateBody, } from "components/common/DataTable";
import { Calendar, CalendarY, Dropdown, GridForm, Input, } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListCustomerDetailWithState, useListSupplierDetailWithState } from "modules/partner/service";
import { useListUserWithState } from "modules/user/service";
import { Checkbox, Dialog } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { useListDebitCuocTamThu, useListDebitDauKyKH, useListDebitDauKyNCC } from "../service";
import { useListContractFileWithState } from "modules/ContractFile/service";
import { deleteDebit } from "../api";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
  const [filter, setFilter] = useState({
    name: "",
    supplierDetailId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
  const { data: supplierDetails } = useListSupplierDetailWithState({ status: 2});
  // --- chuyển sang options bằng useMemo ---
  const customerOptions = useMemo(() => {
    if (!Array.isArray(supplierDetails)) return [];
    return supplierDetails.map((x: any) => ({
      label: x?.partners?.abbreviation ?? "(không tên)",
      value: x.id,
    }));
  }, [supplierDetails]);
  useEffect(() => {
    // Mỗi khi filter thay đổi => cập nhật params
    _setParamsPaginator((prev: any) => ({
      ...prev,
      keyword: filter.name,
      supplierDetailId: filter.supplierDetailId,
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
       add="/debit/addDauKyNCC"
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
          value={filter.supplierDetailId}
          options={customerOptions}
          onChange={(e: any) =>
            setFilter({ ...filter, supplierDetailId: e.target.value })
          }
          label="Nhà cung cấp"
          className={classNames("dropdown-input-sm", "p-dropdown-sm")}
        />
      </div>
    </GridForm>
  );
};

export default function ListDauKyNcc() {
  const { handleParamUrl } = useHandleParamUrl();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const { data: suppliers } = useListSupplierDetailWithState({status: 2});
  const { data: employees } = useListEmployeeWithState({});
  const [paramsPaginator, setParamsPaginator] = useState({
    pageNum: 1,
    pageSize: 20,
    first: 0,
    render: false,
    keyword: "",
  });
  const { data, loading, error, refresh } = useListDebitDauKyNCC({
    params: paramsPaginator,
    debounce: 500,
  });

  // ✅ Client-side pagination
  useEffect(() => {
    if (!data) return;
    handleParamUrl(paramsPaginator);
    const mapped = (data?.data || []).map((row: any) => {
      const cus = suppliers.find((x: any) => x.id === row.supplier_detail_id);
      const _user = employees.find((x: any) => x.user_id === row.updated_by);
      return {
        ...row,
        customerName: cus?.partners?.name || "",
        customerAbb: cus?.partners?.abbreviation || "",
        userName: `${_user?.last_name ?? ""} ${_user?.first_name ?? ""}`.trim(),
      };
    });
    setDisplayData(mapped);
  }, [first, rows, data, paramsPaginator, suppliers]);

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
                    "/debit/detailDauKyNCC",
                    { route: "/debit/delete", action: deleteDebit },
                    paramsPaginator,
                    setParamsPaginator
                );
            }}
           style={{ width: "6em" }} 
          />
          <Column field="accounting_date" header="Ngày hạch toán" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerName" header="Nhà cung cấp" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="price"   body={(row: any) => Helper.formatCurrency(row.price.toString())} header="Số tiền" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="name" header="Ghi chú" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="userName" header="Người thực hiện" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />

        </DataTableClient>
      </div>
    </>
  );
}
