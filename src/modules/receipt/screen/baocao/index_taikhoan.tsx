import { useEffect, useMemo, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient, DateBody, } from "components/common/DataTable";
import { Dropdown, GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListCustomerDetailWithState, useListSupplierDetailWithState } from "modules/partner/service";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { FilterMatchMode } from "primereact/api";
import { deleteReceipt } from "modules/receipt/api";
import { deleteDebit } from "modules/Debit/api";
import { useListMuahangNCC } from "modules/Debit/service";
import { useListBankWithState } from "modules/categories/service";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
  const [filter, setFilter] = useState({
    name: "",
    customerDetailId: "",
    bankId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
  const { data: DMBank } = useListBankWithState({type:1});
    const DMBankOptions = useMemo(() => {
        if (!Array.isArray(DMBank)) return [];
        return DMBank.map((x: any) => ({
          label: `${x.account_number} - ${x.account_holder}`,
          value: x.id,
        }));
      }, [DMBank]);
  useEffect(() => {
    // Mỗi khi filter thay đổi => cập nhật params
    _setParamsPaginator((prev: any) => ({
      ...prev,
      keyword: filter.name,
      customerDetailId: filter.customerDetailId,
      bankId: filter.bankId,
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
         <div className="col-4">
              <Dropdown
                filter
                showClear
                value={filter.bankId}
                options={DMBankOptions}
                onChange={(e: any) =>
                  setFilter({ ...filter, bankId: e.target.value })
                }
                label="Tài khoản"
                className={classNames("dropdown-input-sm", "p-dropdown-sm")}
              />
            </div>
            <div className="col-4">
            
            </div>
    </GridForm>
  );
};

export default function ListBaoCaoTaiKhoan() {
  const { handleParamUrl } = useHandleParamUrl();
  const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      code_receipt: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
            value={[]}
            filters={filters}
            onFilter={(e:any) => setFilters(e.filters)}
            loading={loading}
            filterDisplay="row"
            className={classNames("Custom-DataTableClient")}
            tableStyle={{ minWidth: "1600px" }} 
        >
            <Column field="accounting_date" header="Ngày hạch toán" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
            <Column field="dispatch_code" header="Số tài khoản" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="dispatch_code" header="Số phiếu" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="supplierName" header="Diễn giải" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="supplierAbb" header="Đối tượng" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="supplierAbb" header="Tên quỹ" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="supplierAbb" header="Lý do" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="supplierAbb" header="Thu" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="supplierAbb" header="Chi" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="supplierAbb" header="Tồn" filter showFilterMenu={false}  filterMatchMode="contains"/>
        </DataTableClient>
      </div>
    </>
  );
}
