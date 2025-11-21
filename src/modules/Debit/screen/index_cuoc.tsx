import { useEffect, useMemo, useRef, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, DataTableClient, DateBody, } from "components/common/DataTable";
import { Calendar, CalendarY, Dropdown, GridForm, Input, } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { useListUserWithState } from "modules/user/service";
import { Checkbox, Dialog } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { useListDebitCuocTamThu } from "../service";
import { useListContractFileWithState } from "modules/ContractFile/service";

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

export default function ListCuoc() {
  const { handleParamUrl } = useHandleParamUrl();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<any>();
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const { data: customers } = useListCustomerDetailWithState({status: 1});
  const [paramsPaginator, setParamsPaginator] = useState({
    pageNum: 1,
    pageSize: 20,
    first: 0,
    render: false,
    keyword: "",
  });
  const { data, loading, error, refresh } = useListDebitCuocTamThu({
    params: {...paramsPaginator,ServiceId:19},
    debounce: 500,
  });
  const { data: listContractFile } = useListContractFileWithState({});
  const { data: userInfos } = useListUserWithState({});
  const userInfosOptions = useMemo(() => {
    return userInfos;
  }, [userInfos]);
  const { data: employeeInfos } = useListEmployeeWithState({});
  const employeeOptions = useMemo(() => {
    return employeeInfos;
  }, [employeeInfos]);
  // ✅ Client-side pagination
  useEffect(() => {
    if (!data) return;
    handleParamUrl(paramsPaginator);
    const mapped = (data?.data || []).map((row: any) => {
      const cus = customers.find((x: any) => x.id === row.customer_detail_id);
      const _fileContract = listContractFile.find((x: any) => x.id === row.file_info_id);
      const _user = employeeOptions.find((x: any) => x.user_id === row.updated_by);

      return {
        ...row,
        customerName: cus?.partners?.name || "",
        customerAbb: cus?.partners?.abbreviation || "",
        userName: `${_user?.last_name ?? ""} ${_user?.first_name ?? ""}`.trim(),
         file_number : _fileContract?.file_number
      };
    });
    setDisplayData(mapped);
  }, [listContractFile,employeeOptions,first, rows, data, paramsPaginator, customers]);

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
          tableStyle={{ minWidth: "2000px" }} // ép bảng rộng hơn để có scroll ngang
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
          style={{ width: "6em" }} />
          <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="listEmployee" header="Giao nhận" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="name" header="Tên phí" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="purchase_price"   body={(row: any) => Helper.formatCurrency(row.purchase_price.toString())} header="Số tiền" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="note" header="Ghi chú" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="userName" header="Người thực hiện" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />

        </DataTableClient>
      </div>
    </>
  );
}
