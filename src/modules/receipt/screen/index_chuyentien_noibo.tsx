import { useEffect, useMemo, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient } from "components/common/DataTable";
import { GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { useListReceiptThu } from "../service";
import { deleteReceipt, showReceipt } from "../api";
import { useListEmployeeWithState } from "modules/employee/service";
import { useListBankWithState, useListFundCategoryWithState, useListExpenseWithState } from "modules/categories/service";
import { Helper } from "utils/helper";
import { formOfPayment, typeReceipt } from "utils";
import { useListContractFileWithState } from "modules/ContractFile/service";
import { FilterMatchMode } from "primereact/api";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { MyCalendar } from "components/common/MyCalendar";

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
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [selectedDetail, setSelectedDetail] = useState<any>(null);
    const [paramsPaginator, setParamsPaginator] = useState({
        pageNum: 1,
        pageSize: 20,
        first: 0,
        render: false,
        type: CategoryEnum.country,
        keyword: "",
    });
    const { data, loading, error, refresh } = useListReceiptThu({
        params: {...paramsPaginator},
        debounce: 500,
    });
    const { data: ContractFile } = useListContractFileWithState({
         params: {f:"abc"},
         debounce: 500,
    }); 
    const { data: employees } = useListEmployeeWithState({});
    const { data: DMExpense } = useListExpenseWithState({type:1}); // danh mục chi phí
    const { data: DMBank } = useListBankWithState({type:1});
    const { data: DMQuy } = useListFundCategoryWithState({type:1});
    // ✅ Client-side pagination
    useEffect(() => {
        if (!data) return;
        handleParamUrl(paramsPaginator);
        const mapped = (data?.data || []).map((row: any) => {
                        const _employee = employees.find((x: any) => x.id === row.employee_id);
                        const _fullname_giaonhan = `${_employee?.last_name ?? ""} ${ _employee?.first_name ?? ""}`.trim();
                        const _lydochi = DMExpense.find((x: any) => x.id === row.income_expense_category_id);
                        const _tenquy = DMQuy.find((x: any) => x.id === row.fund_id);
                        const _bank = DMBank.find((x: any) => x.id === row.bank_id);
                        const _hinhthuc = formOfPayment.find((x: any) => x.value === row.form_of_payment);
                        const _nguoitao = employees.find((x: any) => x.user_id === row.created_by);
                        const _sofile = ContractFile.find((x: any) => x.id === row.file_info_id);
                        const _typeReceipt = typeReceipt.find((x: any) => x.typeReceipt === row.type_receipt);
                        return {
                            ...row,
                            fullname_giaonhan : _fullname_giaonhan,
                            lydochi : _lydochi?.name,
                            tenquy: _tenquy?.fund_name,
                            stk: _bank?.account_number,
                            chutk: _bank?.account_holder,
                            nganhang: _bank?.bank_name,
                            hinhthuc: _hinhthuc?.name,
                            nguoitao: `${_nguoitao?.last_name ?? ""} ${_nguoitao?.first_name ?? ""}`.trim(),
                            sofile:_sofile?.file_number,
                            amount: Helper.formatCurrency(row.amount.toString()),
                            total: Helper.formatCurrency(row.total.toString()),
                            typeReceipt: _typeReceipt?.name || "",
                        };
                     });
        setDisplayData(mapped);
    }, [ContractFile,employees,DMExpense,DMBank,DMQuy,first, rows, data, paramsPaginator]);
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
    function getDetail(id:any){
        showReceipt({ id: id}).then(res => {
            const detail = res.data.data
            if (detail) {
                let receiptDetails = detail.receiptDetails;
                if (receiptDetails && receiptDetails.length > 0) {
                  let data = JSON.parse(detail.data);
                    let debits = JSON.parse(data.Debits);
                    if (debits && debits.length > 0) {
                        receiptDetails = receiptDetails.map((x: any) => ({
                            ...x,
                            debit: debits.find((y: any) => y.id == x.debitId) || null,
                        }));
                        setSelectedDetail(receiptDetails);
                    }
                }
            }
            }).catch(err => {
            //setHasError(true)
            }).finally();
    }
    return (
          <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
             <DataTableClient
                    rowHover
                    value={[]}
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
                    <Column
                    header="Thao tác"
                    body={(row: any) => {
                          if(row.type_receipt !== 3){
                              return ActionBody(
                                  row,
                                  null,
                                  { route: "/receipt/delete", action: deleteReceipt },
                                  paramsPaginator,
                                  setParamsPaginator
                              );
                          }
                        }}
                    />
                    <Column field="code_receipt" header="Số chứng từ" filter showFilterMenu={false}  filterMatchMode="contains"/>
                    <Column field="note" header="Ghi chú" />
                    <Column field="nguoitao" header="Người cập nhật" filter showFilterMenu={false}  filterMatchMode="contains"/>
                    <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                </DataTableClient>
          </div>
    );
}