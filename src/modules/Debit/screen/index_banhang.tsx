import { useEffect, useMemo, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient, DateBody, } from "components/common/DataTable";
import { GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { useListBanhangKH, useListDebitMuaBan, useListMuahangNCC } from "../service";
import { FilterMatchMode } from "primereact/api";
import { deleteReceipt } from "modules/receipt/api";

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
       add="/debit/UpdateBanHang"
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

export default function ListBanHang() {
  const { handleParamUrl } = useHandleParamUrl();
  const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      code_receipt: { value: null, matchMode: FilterMatchMode.CONTAINS },
      accounting_date: { value: null, matchMode: FilterMatchMode.CONTAINS },
      sofile: { value: null, matchMode: FilterMatchMode.CONTAINS },
      fullname_giaonhan: { value: null, matchMode: FilterMatchMode.CONTAINS },
      lydochi: { value: null, matchMode: FilterMatchMode.CONTAINS },
      bill: { value: null, matchMode: FilterMatchMode.CONTAINS },
      total_amount: { value: null, matchMode: FilterMatchMode.CONTAINS },
      vat_rate: { value: null, matchMode: FilterMatchMode.CONTAINS },
      total_with_vat: { value: null, matchMode: FilterMatchMode.CONTAINS },
      tenquy: { value: null, matchMode: FilterMatchMode.CONTAINS },
      hinhthuc: { value: null, matchMode: FilterMatchMode.CONTAINS },
      stk: { value: null, matchMode: FilterMatchMode.CONTAINS },
      chutk: { value: null, matchMode: FilterMatchMode.CONTAINS },
      nganhang: { value: null, matchMode: FilterMatchMode.CONTAINS },
      note: { value: null, matchMode: FilterMatchMode.CONTAINS },
      nguoitao: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
  const { data, loading, error, refresh } = useListBanhangKH({
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
      return {
        ...row,
        customerName: cus?.partners?.name || "",
        customerAbb: cus?.partners?.abbreviation || "",
        userName: `${_user?.last_name ?? ""} ${_user?.first_name ?? ""}`.trim(),
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
            totalRecords={displayData?.length || 0}
            currentPageReportTemplate="Tổng số: {totalRecords} bản ghi"
            onPage={(e: any) => {
                setFirst(e.first);
                setRows(e.rows);
            }}
            filters={filters}
            onFilter={(e:any) => setFilters(e.filters)}
            loading={loading}
            filterDisplay="row"
            className={classNames("Custom-DataTableClient")}
            tableStyle={{ minWidth: "2600px" }} 
        >
            <Column
                header="Thao tác"
                body={(row: any) => {
                   
                }}
            />
            <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
            <Column field="code_receipt" header="Số phiếu" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="sofile" header="Đối tượng" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="fullname_giaonhan" header="Tên đối tượng" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="fullname_giaonhan" header="Tên viết tắt" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="total_amount" header="Số tiền" filter showFilterMenu={false}  filterMatchMode="contains"
                  footer={getSumColumn("total_amount")}
                  footerStyle={{ fontWeight: "bold" }}
            />
            <Column field="vat_rate" header="VAT" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="total_with_vat" header="Thành tiền" filter showFilterMenu={false}  filterMatchMode="contains"
                  footer={getSumColumn("total_with_vat")}
                  footerStyle={{ fontWeight: "bold" }}
            />
            <Column field="note" header="Diễn giải" />
            <Column field="nguoitao" header="Người cập nhật" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
            
        </DataTableClient>
      </div>
    </>
  );
}
