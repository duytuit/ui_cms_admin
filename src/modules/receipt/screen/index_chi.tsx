import { useEffect, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient, DateBody } from "components/common/DataTable";
import { GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { useListReceiptChi } from "../service";
import { deleteReceipt } from "../api";
import { useListEmployeeWithState } from "modules/employee/service";
import { useListBankWithState, useListFundCategoryWithState, useListExpenseWithState, useListIncomeExpenseWithState } from "modules/categories/service";
import { Helper } from "utils/helper";
import { formOfPayment, TypeDoiTuong, typeReceipt } from "utils";
import { useListContractFileWithState } from "modules/ContractFile/service";
import { FilterMatchMode } from "primereact/api";
import { useListPartnerDetailWithState } from "modules/partner/service";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
    const [filter, setFilter] = useState({ name: "" });

    useEffect(() => {
        // Mỗi khi filter thay đổi => cập nhật params
        _setParamsPaginator((prev: any) => ({
            ...prev,
            keyword: filter.name,
        }));
    }, [filter.name]);

    return (
        <GridForm
            paramsPaginator={_paramsPaginator}
            setParamsPaginator={_setParamsPaginator}
            filter={filter}
            setFilter={setFilter}
            className="lg:col-9"
            add="/receipt/updateReceiptChiGiaoNhan"
            addName="Phiếu chi giao nhận"
            addOne="/receipt/UpdateReceiptChi"
            addOneName="Phiếu chi"
        >
        </GridForm>
    );
};

export default function ListReceiptChi() {
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
    const [paramsPaginator, setParamsPaginator] = useState({
        pageNum: 1,
        pageSize: 20,
        first: 0,
        render: false,
        type: CategoryEnum.country,
        keyword: "",
    });
    const { data, loading, error, refresh } = useListReceiptChi({
        params: {...paramsPaginator},
        debounce: 500,
    });
    const { data: ContractFile } = useListContractFileWithState({
         params: {f:"abc"},
         debounce: 500,
    }); 
    const { data: employees } = useListEmployeeWithState({});
    const { data: DMExpense } = useListIncomeExpenseWithState({}); 
    const { data: DMBank } = useListBankWithState({type:1});
    const { data: DMQuy } = useListFundCategoryWithState({type:1});
    const { data: listPartner } = useListPartnerDetailWithState({});
    // ✅ Client-side pagination
    useEffect(() => {
        if (!data) return;
        handleParamUrl(paramsPaginator);
        const mapped = (data?.data || []).map((row: any) => {
                        const _lydochi = DMExpense.find((x: any) => x.id === row.income_expense_category_id);
                        const _tenquy = DMQuy.find((x: any) => x.id === row.fund_id);
                        const _bank = DMBank.find((x: any) => x.id === row.bank_id);
                        const _hinhthuc = formOfPayment.find((x: any) => x.value === row.form_of_payment);
                        const _nguoitao = employees.find((x: any) => x.user_id === row.created_by);
                        const _sofile = ContractFile.find((x: any) => x.id === row.file_info_id);
                        const _typeReceipt = typeReceipt.find((x: any) => x.typeReceipt === row.type_receipt);
                        let tendoituong='';

                        if(row.object === 0 || row.object === 1){ //khách hàng,ncc
                              const partner = listPartner.find((x: any) => x.id === row.object_id);
                              tendoituong = partner?.partners?.abbreviation || ""
                        }else{
                            if(row.object === 2){
                                 const _employee = employees.find((x: any) => x.id === row.object_id);
                                tendoituong = `${_employee?.last_name ?? ""} ${ _employee?.first_name ?? ""}`.trim();
                            }else{
                                const _employee = employees.find((x: any) => x.id === row.employee_id);
                                tendoituong = `${_employee?.last_name ?? ""} ${ _employee?.first_name ?? ""}`.trim();
                             }
                        }
                        return {
                            ...row,
                            tendoituong : tendoituong,
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
    return (
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />

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
                        if(row.type_receipt == 8){
                            return ActionBody(
                                row,
                                "/receipt/detail/chi",
                                { route: "/receipt/delete", action: deleteReceipt },
                                paramsPaginator,
                                setParamsPaginator
                            );
                        }
                        if(row.type_receipt == 1){
                            return ActionBody(
                                row,
                                "/receipt/detail/chigiaonhan",
                                { route: "/receipt/delete", action: deleteReceipt },
                                paramsPaginator,
                                setParamsPaginator
                            );
                        }
                    }}
                    style={{ width: "6em" }}
                />
                <Column field="code_receipt" header="Số chứng từ" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column
                    field="accounting_date"
                    header="Ngày chứng từ"
                    body={(e: any) => DateBody(e.accounting_date)}
                    filter
                    showFilterMenu={false}
                    filterMatchMode="contains"
                />
                <Column field="sofile" header="Số file" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column header="Đối tượng"
                  body={(row: any) => TypeDoiTuong.find((x:any) => x.value === row.object)?.name || "NV"} 
                 filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="tendoituong" header="Tên đối tượng" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="lydochi" header="Lý do chi" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="bill" header="Số hóa đơn" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="amount" header="Số tiền" filter showFilterMenu={false}  filterMatchMode="contains"
                     footer={getSumColumn("amount")}
                     footerStyle={{ fontWeight: "bold" }}
                />
                <Column field="total" header="Thành tiền" filter showFilterMenu={false}  filterMatchMode="contains"
                     footer={getSumColumn("total")}
                     footerStyle={{ fontWeight: "bold" }}
                />
                <Column field="tenquy" header="Quỹ" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="typeReceipt" header="Kiểu phiếu" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="hinhthuc" header="Hình thức" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="stk" header="STK" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="chutk" header="Tên tài khoản" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="nganhang" header="Ngân hàng" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="note" header="Ghi chú" />
                <Column field="nguoitao" header="Người cập nhật" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
               
            </DataTableClient>
        </div>
    );
}