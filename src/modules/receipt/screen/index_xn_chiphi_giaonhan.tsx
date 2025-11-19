import { useEffect, useMemo, useRef, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient, DateBody, ActionBodyWithIds } from "components/common/DataTable";
import { Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { Button, Dialog } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { useListContractFileWithState } from "modules/ContractFile/service";
import UpdateHoanUngGiaoNhan from "modules/receipt/screen/update_hoanung_giao_nhan";
import { deleteReceipt } from "../api";
import { FilterMatchMode } from "primereact/api";
import { useListReceipt, useListXacNhanChiPhiGiaoNhan } from "../service";
import { useListBankWithState, useListFundCategoryWithState, useListIncomeExpenseWithState } from "modules/categories/service";
import { formOfPayment } from "utils";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator}: any) => {
    const [filter, setFilter] = useState({ name: "",employeeId:0, customerDetailId: "" ,fromDate:Helper.lastWeekString(),toDate:Helper.toDayString()});
    const { data: customerDetails } = useListCustomerDetailWithState({status:1});
    // --- chuyển sang options bằng useMemo ---
    const customerOptions = useMemo(() => {
        if (!Array.isArray(customerDetails)) return [];
        return customerDetails.map((x: any) => ({
            label: x?.partners?.abbreviation ?? "(không tên)",
            value: x.id,
        }));
    }, [customerDetails]);
     const { data: employees } = useListEmployeeWithState({});
    // lấy ra nhân viên giao nhận với departmentid = 3
    const giaoNhanOptions = useMemo(() => {
      if (!Array.isArray(employees)) return [];

      return employees.filter((x: any) =>
          Array.isArray(x.employee_departments) &&
          x.employee_departments[0]?.department_id === 3
        )
        .map((x: any, index: number) => ({
          label: `${index + 1}. ${x.last_name ?? ""} ${x.first_name ?? ""}`.trim(),
          value: x.id,
        }));
    }, [employees]);
 
    useEffect(() => {
        // Mỗi khi filter thay đổi => cập nhật params
        _setParamsPaginator((prev: any) => ({
            ...prev,
            keyword: filter.name,
            customerDetailId : filter.customerDetailId,
            fromDate: filter.fromDate,
            toDate:filter.toDate,
            employeeId:filter.employeeId
        }));
        if (giaoNhanOptions.length > 0 && !filter.employeeId) {
          setFilter(prev => ({ ...prev, employeeId: giaoNhanOptions[0].value }));
        }
    }, [giaoNhanOptions,filter]);

    return (
      <>
       <GridForm
            paramsPaginator={_paramsPaginator}
            setParamsPaginator={_setParamsPaginator}
            filter={filter}
            setFilter={setFilter}
            className="lg:col-9"
        >
            <div className="col-2">
                <MyCalendar dateFormat="dd/mm/yy" 
                    value={filter.fromDate} 
                    onChange={(e: any) =>
                    setFilter({ ...filter, fromDate: e })}
                    className={classNames("w-full", "p-inputtext", "input-sm")} />
            </div>
            <div className="col-2">
                <MyCalendar dateFormat="dd/mm/yy"
                  value={filter.toDate} 
                  onChange={(e: any) =>
                  setFilter({ ...filter, toDate: e })}
                  className={classNames("w-full", "p-inputtext", "input-sm")} />
            </div>
            <div className="col-4">
                <Dropdown
                    filter
                    showClear
                    value={filter.customerDetailId}
                    options={customerOptions}
                    onChange={(e: any) => setFilter({ ...filter, customerDetailId: e.target.value })}
                    label="Khách hàng"
                    className={classNames("dropdown-input-sm", "p-dropdown-sm")}
                />
            </div>
            <div className="col-4">
                <Dropdown
                    filter
                    showClear
                    value={filter.employeeId}
                    options={giaoNhanOptions}
                    onChange={(e: any) => setFilter({ ...filter, employeeId: e.target.value })}
                    label="Giao nhận"
                    className={classNames("dropdown-input-sm", "p-dropdown-sm")}
                />
            </div>
        </GridForm>
      </>
       
    );
};

export default function ListChiPhiGiaoNhan() {
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
        const [visible, setVisible] = useState(false);
        const [receiptData, setRecieptData] = useState<any[]>([]);
        const [detail, setDetail] = useState<any>();
        const [paramsPaginator, setParamsPaginator] = useState({
            pageNum: 1,
            pageSize: 20,
            first: 0,
            render: false,
            keyword: "",
        });
        const { data, loading, error, refresh } = useListXacNhanChiPhiGiaoNhan({
            params: {...paramsPaginator },
            debounce: 500,
        });
        const { data: ContractFile } = useListContractFileWithState({
             params: {f:"abc"},
             debounce: 500,
        }); 
        const { data: employees } = useListEmployeeWithState({});
        const { data: DMExpense } = useListIncomeExpenseWithState({}); // danh mục chi phí
        const { data: DMBank } = useListBankWithState({type:1});
        const { data: DMQuy } = useListFundCategoryWithState({type:1});
        const openDialogAdd = (row:any) => {
            const data = JSON.parse(row.data)
            setRecieptData(data)
            setDetail(row)
            setVisible(true);
        };
        const handleModalClose = () => {
            setVisible(false);
            refresh?.(); // reload debitDispatch
        };
        // ✅ Client-side pagination
        useEffect(() => {
            if (!data) return;
            handleParamUrl(paramsPaginator);
            const mapped = (data?.data || []).map((row: any) => {
                            const _employee = employees.find((x: any) => x.id === row.employee_id);
                            const _fullname_giaonhan = `${_employee?.last_name ?? ""} ${ _employee?.first_name ?? ""}`.trim();
                            const _lydochi = DMExpense.find((x: any) => x.id === row.income_expense_category_id);
                            // Tính tổng tiền chi tiết
                            const amount = (row.receipt_details ?? []).reduce((a:any, b:any) => a + (b.amount ?? 0), 0);
                            // VAT (nếu có, ví dụ row.vat_rate = 10 nghĩa là 10%)
                            const vatRate = row.vat ?? 0; // mặc định 0%
                            const vatAmount = (amount * vatRate) / 100;
                            const totalWithVat = amount + vatAmount;
                            const _tenquy = DMQuy.find((x: any) => x.id === row.fund_id);
                            const _bank = DMBank.find((x: any) => x.id === row.bank_id);
                            const _hinhthuc = formOfPayment.find((x: any) => x.value === row.form_of_payment);
                            const _nguoitao = employees.find((x: any) => x.user_id === row.created_by);
                            const _sofile = ContractFile.find((x: any) => x.id === row.file_info_id);
                            
                            return {
                                ...row,
                                fullname_giaonhan : _fullname_giaonhan,
                                lydochi : _lydochi?.name,
                                total_amount:  Helper.formatCurrency(amount.toString()),
                                vat_rate: vatRate,
                                vat_amount: vatAmount,
                                total_with_vat: Helper.formatCurrency(totalWithVat.toString()),
                                tenquy: _tenquy?.fund_name,
                                stk: _bank?.account_number,
                                chutk: _bank?.account_holder,
                                nganhang: _bank?.bank_name,
                                hinhthuc: _hinhthuc?.name,
                                nguoitao: `${_nguoitao?.last_name ?? ""} ${_nguoitao?.first_name ?? ""}`.trim(),
                                sofile:_sofile?.file_number
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
      <>
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator}/>
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
                body={(row: any) =>
                    ActionBody(row, null, null, null, null, () =>
                        openDialogAdd(row)
                    )
                }
              />
               <Column header="Trạng thái" body={(row: any) => {
                    if(row.status == 1){
                      return <Button label="đã xử lý" rounded severity="success" size="small" text  />
                    }else{
                      return <Button label="chưa xử lý" rounded severity="warning" size="small" text  />
                    }
                }} filter showFilterMenu={false} filterMatchMode="contains" />
              <Column
               body={(row: any) => {
                    return "YC hoàn ứng "+row.description;
                }}
               header="Yêu cầu hoàn ứng" filter showFilterMenu={false}  filterMatchMode="contains"/>
              <Column 
                body={(row: any) => {
                    return row.status == 1 ? row.code_receipt : null;
                }}
                header="Số chứng từ" filter showFilterMenu={false}  filterMatchMode="contains"/>
              <Column
                  field="accounting_date"
                  header="Ngày chứng từ"
                  body={(row: any) => {
                        return row.status == 1 ? DateBody(row.accounting_date) : null;
                  }}
                  filter
                  showFilterMenu={false}
                  filterMatchMode="contains"
              />
              <Column field="fullname_giaonhan" header="Người giao nhận" filter showFilterMenu={false}  filterMatchMode="contains"/>
              <Column field="lydochi" header="Lý do chi" filter showFilterMenu={false}  filterMatchMode="contains"/>
              <Column field="bill" header="Số hóa đơn" filter showFilterMenu={false}  filterMatchMode="contains"/>
              <Column field="total_amount" header="Số tiền" filter showFilterMenu={false}  filterMatchMode="contains"
                  footer={getSumColumn("total_amount")}
                  footerStyle={{ fontWeight: "bold" }}
              />
              <Column field="vat_rate" header="VAT" filter showFilterMenu={false}  filterMatchMode="contains"/>
              <Column field="total_with_vat" header="Thành tiền" filter showFilterMenu={false}  filterMatchMode="contains"
                  footer={getSumColumn("total_with_vat")}
                  footerStyle={{ fontWeight: "bold" }}
              />
              <Column field="tenquy" header="Quỹ" filter showFilterMenu={false}  filterMatchMode="contains"/>
              <Column
               body={(row: any) => {
                        return row.status == 1 ? row.hinhthuc : null;
               }}
               header="Hình thức" filter showFilterMenu={false}  filterMatchMode="contains"/>
              <Column field="stk" header="STK" filter showFilterMenu={false}  filterMatchMode="contains"/>
              <Column field="chutk" header="Tên tài khoản" filter showFilterMenu={false}  filterMatchMode="contains"/>
              <Column field="nganhang" header="Ngân hàng" filter showFilterMenu={false}  filterMatchMode="contains"/>
              <Column field="note" header="Ghi chú" />
              <Column field="nguoitao" header="Người cập nhật" filter showFilterMenu={false}  filterMatchMode="contains"/>
              <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
          </DataTableClient>
        </div>
          <Dialog
                position="top"
                dismissableMask
                visible={visible}
                onHide={() => setVisible(false)}
                style={{ width: "60vw", top:"30px" }}
                >
                <p className="m-0">
                    {detail && <UpdateHoanUngGiaoNhan detail={detail} debits={receiptData} onClose={handleModalClose} ></UpdateHoanUngGiaoNhan>}
                </p>
          </Dialog>
      </>
    );
}
