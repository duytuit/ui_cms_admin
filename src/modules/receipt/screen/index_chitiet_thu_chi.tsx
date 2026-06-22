import { useEffect, useState } from "react";
import { Column, TimeBody, DataTableClient, DateBody } from "components/common/DataTable";
import { Dropdown, GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { useListChiTietThuChi } from "../service";
import { useListEmployeeWithState } from "modules/employee/service";
import { useListBankWithState, useListFundCategoryWithState, useListIncomeExpenseWithState } from "modules/categories/service";
import { Helper } from "utils/helper";
import { formOfPayment, TypeIncomeExpense, typeReceipt } from "utils";
import { FilterMatchMode } from "primereact/api";
import { MyCalendar } from "components/common/MyCalendar";
import { Splitter } from "primereact/splitter";
import { Button } from "primereact/button";
import { ExportExcelChiTietThuChi } from "../api";

const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
  const [filter, setFilter] = useState({
    name: "",
    customerDetailId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
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
   async function ExportChiTietThuChi() {
      const respo = await ExportExcelChiTietThuChi(
        Helper.convertObjectToQueryString(_paramsPaginator)
      );
  
      const blob = new Blob([respo.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
  
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "chi_tiet_thu_chi.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // ✅ tránh leak memory
    }
   const items = [
        {
            label: 'Chi tiết thu chi',
            icon: "pi pi-file-export",
            command: () => ExportChiTietThuChi()
        }
    ];
  return (
    <GridForm
      paramsPaginator={_paramsPaginator}
      setParamsPaginator={_setParamsPaginator}
      filter={filter}
      setFilter={setFilter}
      className="lg:col-9"
      MenuItems={items}
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

export default function BaoCaoChiTietThuChi() {
    const { handleParamUrl } = useHandleParamUrl();
    const [displayData, setDisplayData] = useState<any>();
    const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    lydo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    total_amount: { value: null, matchMode: FilterMatchMode.CONTAINS },
    tenquy: { value: null, matchMode: FilterMatchMode.CONTAINS },
    code_receipt: { value: null, matchMode: FilterMatchMode.CONTAINS },
    hinhthuc: { value: null, matchMode: FilterMatchMode.CONTAINS },
    stk: { value: null, matchMode: FilterMatchMode.CONTAINS },
    chutk: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nganhang: { value: null, matchMode: FilterMatchMode.CONTAINS },
    note: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nguoitao: { value: null, matchMode: FilterMatchMode.CONTAINS },
    iecat_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    income_expense_category_id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [paramsPaginator, setParamsPaginator] = useState({
        pageNum: 1,
        pageSize: 20,
        first: 0,
        render: false,
        type: CategoryEnum.country,
        keyword: "",
    });
    const { data, loading, error, refresh } = useListChiTietThuChi({
        params: {...paramsPaginator},
        debounce: 500,
    });
    const { data: employees } = useListEmployeeWithState({});
    const { data: DMExpense } = useListIncomeExpenseWithState({}); 
    const { data: DMBank } = useListBankWithState({type:1});
    const { data: DMQuy } = useListFundCategoryWithState({type:1});
    // ✅ Client-side pagination
    useEffect(() => {
        if (!data) return;
        handleParamUrl(paramsPaginator);
        const mapped = (data?.data || []).map((row: any,i: number) => {
                        const _lydo = DMExpense.find((x: any) => x.id === row.income_expense_category_id);
                        const _tenquy = DMQuy.find((x: any) => x.id === row.fund_id);
                        const _bank = DMBank.find((x: any) => x.id === row.bank_id);
                        const _hinhthuc = formOfPayment.find((x: any) => x.value === row.form_of_payment);
                        const _nguoitao = employees.find((x: any) => x.user_id === row.created_by);
                        const _typeReceipt = typeReceipt.find((x: any) => x.typeReceipt === row.type_receipt);
                        return {
                            ...row,
                            id_key: `${row.id}_${i}`,
                            lydo : _lydo?.name,
                            tenquy: _tenquy?.fund_name,
                            stk: _bank?.account_number,
                            chutk: _bank?.account_holder,
                            nganhang: _bank?.bank_name,
                            hinhthuc: _hinhthuc?.name,
                            nguoitao: `${_nguoitao?.last_name ?? ""} ${_nguoitao?.first_name ?? ""}`.trim(),
                            typeReceipt: _typeReceipt?.name || "",
                        };
                     });
        setDisplayData(mapped);
    }, [employees,DMExpense,DMBank,DMQuy, data, paramsPaginator]);
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
            <div style={{ height: 'calc(100vh - 8rem)' }}>
                 <Splitter layout="vertical" style={{ height: '100%', width: '100%' }}>
                     <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <DataTableClient
                                rowHover
                                value={displayData}
                                loading={loading}
                                dataKey="id_key"
                                filters={filters}
                                onFilter={(e:any) => setFilters(e.filters)}
                                title="Tài khoản"
                                filterDisplay="row"
                                className={classNames("Custom-DataTableClient")}
                                scrollable
                                scrollHeight="flex"
                                style={{ flex: 1 }}
                                tableStyle={{ minWidth: "2000px" }}
                            >
                                <Column
                                field="income_expense_category_id"
                                header="Loại phí"
                                body={(row: any) => {
                                  const type = TypeIncomeExpense.find((t) => t.value === row.income_expense_category_id);
                                  return  <Button label={type ? type.label : "không xác định"} rounded severity="info" size="small" text  />
                                }}
                                filter
                                filterElement={(options:any) => (
                                    <Dropdown
                                        value={options.value}
                                        options={TypeIncomeExpense}
                                        onChange={(e:any) => {
                                          options.filterApplyCallback(e.value)
                                        }}
                                        label="loại phí"
                                        className="p-column-filter"
                                        showClear
                                    />
                                )}
                                showFilterMenu={false}  style={{ width:"180px" }}/>
                                 <Column
                                    field="accounting_date"
                                    header="Ngày chứng từ"
                                    body={(e: any) => DateBody(e.accounting_date)}
                                    filter
                                    showFilterMenu={false}
                                    filterMatchMode="contains"
                                />
                                <Column field="code_receipt" header="Số chứng từ" filter showFilterMenu={false}  filterMatchMode="contains"/>
                                <Column field="amount" body={(row: any) => Helper.formatCurrency((row.amount ??0).toString())}  header="Số tiền" filter showFilterMenu={false}  filterMatchMode="contains"
                                    footer={getSumColumn("amount")}
                                    footerStyle={{ fontWeight: "bold" }}
                                      style={{ textAlign: 'right' }}
                                />
                                <Column field="total_amount"  body={(row: any) => Helper.formatCurrency((row.total_amount ?? 0).toString())} header="Thành tiền" filter showFilterMenu={false}  filterMatchMode="contains"
                                    footer={getSumColumn("total_amount")}
                                    footerStyle={{ fontWeight: "bold" }}
                                      style={{ textAlign: 'right' }}
                                />
                                <Column field="tenquy" header="Quỹ" filter showFilterMenu={false}  filterMatchMode="contains"/>
                                <Column field="hinhthuc" header="Hình thức" filter showFilterMenu={false}  filterMatchMode="contains"/>
                                <Column field="stk" header="STK" filter showFilterMenu={false}  filterMatchMode="contains"/>
                                <Column field="chutk" header="Tên tài khoản" filter showFilterMenu={false}  filterMatchMode="contains"/>
                                <Column field="nganhang" header="Ngân hàng" filter showFilterMenu={false}  filterMatchMode="contains"/>
                                <Column field="note" header="Ghi chú" filter showFilterMenu={false}  filterMatchMode="contains"/>
                                <Column field="nguoitao" header="Người cập nhật" filter showFilterMenu={false}  filterMatchMode="contains"/>
                                <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                            </DataTableClient>
                      </div>
                 </Splitter>
            </div>
          </div>
    );
}