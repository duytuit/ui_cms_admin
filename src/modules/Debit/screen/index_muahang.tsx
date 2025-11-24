import { useEffect, useMemo, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient, DateBody, } from "components/common/DataTable";
import { GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListCustomerDetailWithState, useListSupplierDetailWithState } from "modules/partner/service";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { useListMuahangNCC } from "../service";
import { FilterMatchMode } from "primereact/api";
import { deleteReceipt } from "modules/receipt/api";
import { deleteDebit } from "../api";

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
       add="/debit/UpdateMuaHang"
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

export default function ListMuaHang() {
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
  const { data, loading, error, refresh } = useListMuahangNCC({
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
      const cus = suppliers.find((x: any) => x.id === row.supplier_detail_id);
      const _user = employees.find((x: any) => x.user_id === row.updated_by);
      const thanh_tien = Math.round(row.price * (1 + row.vat / 100));
      return {
        ...row,
        supplierName: cus?.partners?.name || "",
        supplierAbb: cus?.partners?.abbreviation || "",
        userName: `${_user?.last_name ?? ""} ${_user?.first_name ?? ""}`.trim(),
        thanh_tien:thanh_tien
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
            tableStyle={{ minWidth: "1600px" }} 
        >
            <Column
                header="Thao tác"
                style={{width:"100px"}}
                body={(row: any) => {
                    return ActionBody(
                        row,
                        "/debit/detailMuaHang",
                        { route: "/debit/delete", action: deleteDebit },
                        paramsPaginator,
                        setParamsPaginator
                    );
                }}
            />
            <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
            <Column field="dispatch_code" header="Số phiếu" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="supplierName" header="Tên đối tượng" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="supplierAbb" header="Tên viết tắt" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="price" header="Số tiền" filter showFilterMenu={false}  filterMatchMode="contains"
                  footer={getSumColumn("price")}
                  footerStyle={{ fontWeight: "bold" }}
            />
            <Column field="vat" header="VAT" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="thanh_tien" header="Thành tiền" filter showFilterMenu={false}  filterMatchMode="contains"
                  footer={getSumColumn("thanh_tien")}
                  footerStyle={{ fontWeight: "bold" }}
            />
            <Column field="note" header="Diễn giải" />
            <Column field="userName" header="Người cập nhật" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
            
        </DataTableClient>
      </div>
    </>
  );
}
