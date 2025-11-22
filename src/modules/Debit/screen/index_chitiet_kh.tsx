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
import { useListDebitCuocTamThu, useListDebitDauKyKH } from "../service";
import { useListContractFileWithState } from "modules/ContractFile/service";
import { deleteDebit } from "../api";
import { TypeDebitDKKH } from "utils";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

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

export default function ListChiTietKH() {
  const { handleParamUrl } = useHandleParamUrl();
  const [selectedFileGiaRows, setSelectedFileGiaRows] = useState<any[]>([]);
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
  const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column rowSpan={2} />
                <Column header="Ngày hạch toán" rowSpan={2} />
                <Column header="Chứng từ" headerClassName="my-title-center" colSpan={6} />
                <Column header="Nợ" headerClassName="my-title-center" colSpan={2} />
                <Column header="Đã thu" headerClassName="my-title-center" colSpan={2} />
                <Column frozen alignFrozen="right" className="font-bold"  header="Còn lại" headerClassName="my-title-center" colSpan={6} />
            </Row>
            <Row>
                <Column header="Số file" />
                <Column header="Số bill" />
                <Column header="Số tờ khai" />
                <Column header="Mã điều xe" />
                <Column header="Nội dung" />
                <Column header="Số hóa đơn" />
                <Column header="Dịch vụ" />
                <Column header="Chi hộ" />
                <Column header="Dịch vụ" />
                <Column header="Chi hộ" />
                <Column frozen alignFrozen="right" header="Dịch vụ" />
                <Column frozen alignFrozen="right" className="font-bold"  header="Chi hộ" />
                <Column frozen alignFrozen="right" className="font-bold"  header="Còn lại" />
                <Column frozen alignFrozen="right" className="font-bold"  header="" />
                <Column frozen alignFrozen="right" className="font-bold"  header="Số thu dịch vụ" />
                <Column frozen alignFrozen="right" className="font-bold"  header="Số thu chi hộ" />
            </Row>
        </ColumnGroup>
    );
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
          headerColumnGroup={headerGroup}
          loading={loading}
          dataKey="id"
          title="Tài khoản"
          filterDisplay="row"
          className={classNames("Custom-DataTableClient")}
          scrollable
          tableStyle={{ minWidth: "1600px" }} // ép bảng rộng hơn để có scroll ngang
        >
          
          <Column field="customerName" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerName" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb"  filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb"  filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb"  filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb"  filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb"  filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb"  filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb"  filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb"  filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb"  filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb" frozen alignFrozen="right" className="font-bold" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb" frozen alignFrozen="right" className="font-bold" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb" frozen alignFrozen="right" className="font-bold" filter showFilterMenu={false} filterMatchMode="contains" />
           <Column
            header={
              <Checkbox
                checked={
                  selectedFileGiaRows.length === displayData.length &&
                  displayData.length > 0
                }
                onChange={(e: any) => {
                  if (e.checked)
                    setSelectedFileGiaRows(displayData.map((d) => d.id));
                  else setSelectedFileGiaRows([]);
                }}
              />
            }
            body={(rowData: any) => (
              <Checkbox
                className="p-checkbox-sm"
                checked={selectedFileGiaRows.includes(rowData.id)}
                onChange={(e: any) => {
                  if (e.checked)
                    setSelectedFileGiaRows((prev) => [...prev, rowData.id]);
                  else
                    setSelectedFileGiaRows((prev) =>
                      prev.filter((id) => id !== rowData.id)
                    );
                }}
                onClick={(e: any) => e.stopPropagation()} // ⚡ chặn row click
              />
            )}
            frozen alignFrozen="right"
            style={{ width: "3em" }}
          />
          <Column field="customerAbb" frozen alignFrozen="right" className="font-bold" filter showFilterMenu={false} filterMatchMode="contains" />
          <Column field="customerAbb" frozen alignFrozen="right" className="font-bold" filter showFilterMenu={false} filterMatchMode="contains" />

        </DataTableClient>
      </div>
    </>
  );
}
