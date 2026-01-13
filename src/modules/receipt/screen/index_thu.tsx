import { useEffect, useMemo, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient, DateBody } from "components/common/DataTable";
import { Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { useListReceipt, useListReceiptThu } from "../service";
import { deleteReceipt, showReceipt } from "../api";
import { useListEmployeeWithState } from "modules/employee/service";
import { useListBankWithState, useListFundCategoryWithState, useListExpenseWithState, useListIncomeExpenseWithState } from "modules/categories/service";
import { Helper } from "utils/helper";
import { formOfPayment, typeReceipt } from "utils";
import { useListContractFileWithState } from "modules/ContractFile/service";
import { FilterMatchMode } from "primereact/api";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { MyCalendar } from "components/common/MyCalendar";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { DataTable } from "components/uiCore";
import { showWithIds } from "modules/Debit/api";
import { text } from "stream/consumers";

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
      add="/receipt/UpdateReceiptThu"
      addName="Phiếu thu"
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

export default function ListReceiptThu() {
    const { handleParamUrl } = useHandleParamUrl();
    const [displayData, setDisplayData] = useState<any>();
    const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    code_receipt: { value: null, matchMode: FilterMatchMode.CONTAINS },
    accounting_date: { value: null, matchMode: FilterMatchMode.CONTAINS },
    sofile: { value: null, matchMode: FilterMatchMode.CONTAINS },
    fullname_giaonhan: { value: null, matchMode: FilterMatchMode.CONTAINS },
    lydo: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
    const { data: DMExpense } = useListIncomeExpenseWithState({}); 
    const { data: DMBank } = useListBankWithState({type:1});
    const { data: DMQuy } = useListFundCategoryWithState({type:1});
    // ✅ Client-side pagination
    useEffect(() => {
        if (!data) return;
        handleParamUrl(paramsPaginator);
        const mapped = (data?.data || []).map((row: any) => {
                        const _employee = employees.find((x: any) => x.id === row.employee_id);
                        const _fullname_giaonhan = `${_employee?.last_name ?? ""} ${ _employee?.first_name ?? ""}`.trim();
                        const _lydo = DMExpense.find((x: any) => x.id === row.income_expense_category_id);
                        const _tenquy = DMQuy.find((x: any) => x.id === row.fund_id);
                        const _bank = DMBank.find((x: any) => x.id === row.bank_id);
                        const _hinhthuc = formOfPayment.find((x: any) => x.value === row.form_of_payment);
                        const _nguoitao = employees.find((x: any) => x.user_id === row.created_by);
                        const _sofile = ContractFile.find((x: any) => x.id === row.file_info_id);
                        const _typeReceipt = typeReceipt.find((x: any) => x.typeReceipt === row.type_receipt);
                        return {
                            ...row,
                            fullname_giaonhan : _fullname_giaonhan,
                            lydo : _lydo?.name,
                            tenquy: _tenquy?.fund_name,
                            stk: _bank?.account_number,
                            chutk: _bank?.account_holder,
                            nganhang: _bank?.bank_name,
                            hinhthuc: _hinhthuc?.name,
                            nguoitao: `${_nguoitao?.last_name ?? ""} ${_nguoitao?.first_name ?? ""}`.trim(),
                            sofile:_sofile?.file_number,
                            typeReceipt: _typeReceipt?.name || "",
                        };
                     });
        setDisplayData(mapped);
    }, [ContractFile,employees,DMExpense,DMBank,DMQuy, data, paramsPaginator]);
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
            <div style={{ height: 'calc(100vh - 8rem)' }}>
                 <Splitter layout="vertical" style={{ height: '100%', width: '100%' }}>
                    <SplitterPanel
                      size={75}
                      minSize={10}
                      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <DataTableClient
                                rowHover
                                value={displayData}
                                loading={loading}
                                dataKey="id"
                                filters={filters}
                                onFilter={(e:any) => setFilters(e.filters)}
                                title="Tài khoản"
                                filterDisplay="row"
                                className={classNames("Custom-DataTableClient")}
                                scrollable
                                scrollHeight="flex"
                                style={{ flex: 1 }}
                                tableStyle={{ minWidth: "2000px" }}
                                onRowClick={(e: any) => {
                                    getDetail(e.data.id);
                                }}
                            >
                                <Column
                                header="Thao tác"
                                body={(row: any) => {
                                     if ([9].includes(row.type_receipt)) {
                                         // 9: thu khác có thể sửa được
                                          return ActionBody(
                                              row,
                                              "/receipt/detail/thu",
                                              { route: "/receipt/delete", action: deleteReceipt },
                                              paramsPaginator,
                                              setParamsPaginator
                                          );
                                      }else{
                                        if (![3, 10,11].includes(row.type_receipt)) {
                                            // 3: thu hoàn ứng giao nhận
                                            // 10: chuyển tiền nội bộ
                                            return ActionBody(
                                                row,
                                                null,
                                                { route: "/receipt/delete", action: deleteReceipt },
                                                paramsPaginator,
                                                setParamsPaginator
                                            );
                                        }
                                      }
                                    }}
                                  style={{width:"6em"}}
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
                                <Column field="amount" header="Số tiền" filter showFilterMenu={false}  filterMatchMode="contains"
                                    footer={getSumColumn("amount")}
                                    footerStyle={{ fontWeight: "bold" }}
                                />
                                <Column field="total" header="Thành tiền" filter showFilterMenu={false}  filterMatchMode="contains"
                                    footer={getSumColumn("total")}
                                    footerStyle={{ fontWeight: "bold" }}
                                />
                                <Column field="lydo" header="Lý do" filter showFilterMenu={false}  filterMatchMode="contains"/>
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
                    </SplitterPanel>
                    <SplitterPanel
                      size={25}
                      minSize={10}
                      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                          <b>Chi tiết phiếu thu</b>
                            <DataTable 
                              rowHover
                              scrollable
                              scrollHeight="flex"
                              style={{ flex: 1 }}
                              value={selectedDetail}
                            >
                            <Column 
                              body={(row: any) =>
                                 {
                                   return row.debit?.customerName
                                 }
                              }
                             header="Tên khách hàng" />
                            <Column header="Số file" 
                             body={(row: any) =>
                                 {
                                   let data = JSON.parse(row?.debit?.data || '{}');
                                   return data.fileNumber
                                 }
                              }
                            />
                            <Column field="dispatch_code" header="Mã điều xe" 
                             body={(row: any) =>
                                   {
                                      if(row.debit?.type == 1){
                                         return row.debit?.dispatch_code
                                      }
                                   }
                              }/>
                            <Column header="Dịch vụ" 
                             body={(row: any) =>
                                 {
                                   return row.debit?.name
                                 }
                              }
                            /> 
                            <Column 
                              field="amount" 
                              body={(row: any) =>{
                                  return Helper.formatCurrency(row.amount.toString());
                              }} 
                              header="Số tiền" 
                              footer={selectedDetail ? Helper.formatCurrency((selectedDetail?.reduce((acc: any, item: any) => {
                                  return acc + (item.amount || 0);
                              }, 0)).toString()) : undefined}
                              style={{ textAlign: 'right' }}
                              className="table-title-center"
                            />
                            <Column field="vat" header="VAT" style={{ textAlign: 'center' }} className="table-title-center" />
                            <Column 
                                body={(row: any) =>{
                                    const thanh_tien = Math.round(row.amount * (1 + row.vat / 100));
                                    return Helper.formatCurrency(thanh_tien.toString());

                                }} 
                                header="Thành tiền" 
                                footer={selectedDetail ? Helper.formatCurrency((selectedDetail?.reduce((acc: any, item: any) => {
                                    const thanh_tien = Math.round(item.amount * (1 + item.vat / 100));
                                    return acc + thanh_tien;
                                }, 0)).toString()) : undefined}
                                style={{ textAlign: 'right' }}
                                className="table-title-center"
                             />
                            </DataTable>
                        </div>
                    </SplitterPanel>
                 </Splitter>
            </div>
           
          </div>
    );
}