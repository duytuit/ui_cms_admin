import { useEffect, useMemo, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient, DateBody, } from "components/common/DataTable";
import { GridForm, } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { formOfPayment } from "utils";
import { FilterMatchMode } from "primereact/api";
import { useGetSoDuDauKyAsync } from "../service";
import { useListBankWithState, useListExpenseWithState, useListFundCategoryWithState } from "modules/categories/service";
import { deleteReceipt } from "../api";

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

export default function ListDauKyTaiKhoan() {
  const { handleParamUrl } = useHandleParamUrl();
   const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      customerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      customerAbb: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      type: { value: null, matchMode: FilterMatchMode.CONTAINS },
      });
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const { data: DMExpense } = useListExpenseWithState({type:1,enable:1}); // danh mục chi phí
  const { data: DMBank } = useListBankWithState({type:1});
  const { data: DMQuy } = useListFundCategoryWithState({type:1});
  const { data: employees } = useListEmployeeWithState({});
  const [paramsPaginator, setParamsPaginator] = useState({
    pageNum: 1,
    pageSize: 20,
    first: 0,
    render: false,
    keyword: "",
  });
  const { data, loading, error, refresh } = useGetSoDuDauKyAsync({
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
              const _tenquy = DMQuy.find((x: any) => x.id === row.fund_id);
              const _bank = DMBank.find((x: any) => x.id === row.bank_id);
              const _hinhthuc = formOfPayment.find((x: any) => x.value === row.form_of_payment);
              const _nguoitao = employees.find((x: any) => x.user_id === row.created_by);
              return {
                  ...row,
                  tenquy: _tenquy?.fund_name,
                  stk: _bank?.account_number,
                  chutk: _bank?.account_holder,
                  nganhang: _bank?.bank_name,
                  hinhthuc: _hinhthuc?.name,
                  nguoitao: `${_nguoitao?.last_name ?? ""} ${_nguoitao?.first_name ?? ""}`.trim(),
                  amount: Helper.formatCurrency(row.amount.toString()),
                  total: Helper.formatCurrency(row.total.toString()),
              };
          });
          setDisplayData(mapped);
     }, [employees,DMExpense,DMBank,DMQuy,first, rows, data, paramsPaginator]);

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
            tableStyle={{ minWidth: "2000px" }} 
        >
            <Column
                header="Thao tác"
                body={(row: any) => {
                      return ActionBody(
                            row,
                            "/receipt/ListDauKyTaiKhoan/detail",
                            { route: "/receipt/delete", action: deleteReceipt },
                            paramsPaginator,
                            setParamsPaginator
                        );
                }}
                style={{ width: "6em" }}
            />
            <Column
                field="accounting_date"
                header="Ngày chứng từ"
                body={(e: any) => DateBody(e.accounting_date)}
                filter
                showFilterMenu={false}
                filterMatchMode="contains"
            />
            <Column field="code_receipt" header="Số chứng từ" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="amount" header="Số tiền" filter showFilterMenu={false}  filterMatchMode="contains"
                  footer={getSumColumn("amount")}
                  footerStyle={{ fontWeight: "bold" }}
            />
            <Column field="total" header="Thành tiền" filter showFilterMenu={false}  filterMatchMode="contains"
                  footer={getSumColumn("total")}
                  footerStyle={{ fontWeight: "bold" }}
            />
            <Column field="tenquy" header="Quỹ" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="hinhthuc" header="Hình thức" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="stk" header="STK" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="chutk" header="Tên tài khoản" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="nganhang" header="Ngân hàng" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column field="note" header="Ghi chú" />
            <Column field="nguoitao" header="Người cập nhật" filter showFilterMenu={false}  filterMatchMode="contains"/>
            <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
        </DataTableClient>
      </div>
    </>
  );
}
