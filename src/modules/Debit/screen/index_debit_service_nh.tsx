import { useEffect, useMemo, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient, DateBody, ActionBodyWithIds } from "components/common/DataTable";
import { Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { typeDebit } from "utils";
import { useListCustomerDetailWithState, useListPartnerDetailWithState } from "modules/partner/service";
import { useListUserWithState } from "modules/user/service";
import { Button, Checkbox, DataTable, Dialog } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useListContractFileHasDebitNangHa, useListContractFileHasDebitService, useListContractFileNotDebitNangHa, useListContractFileNotService, useListContractFileWithState } from "modules/ContractFile/service";
import {  deleteMultiDebit, delMultiDebit } from "../api";
import UpdateDebitNangHa from "./update_service_nh";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
    const [filter, setFilter] = useState({ name: "", customerDetailId: "" ,fromDate:Helper.lastWeekString(),toDate:Helper.toDayString()});
    const { data: customerDetails } = useListCustomerDetailWithState({status:1});
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
            customerDetailId : filter.customerDetailId,
            fromDate: filter.fromDate,
            toDate:filter.toDate,
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
                <Input
                    value={filter.name}
                    onChange={(e: any) => setFilter({ ...filter, name: e.target.value })}
                    label="Tìm kiếm"
                    size="small"
                    className={classNames("input-sm")}
                />
            </div>
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
            <div className="col-6">
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
        </GridForm>
    );
};

export default function ListContractFileNangHa() {
    const employeeInfo = localStorage.getItem('employeeInfo') ? JSON.parse(localStorage.getItem('employeeInfo') || '{}') : null;
    const { handleParamUrl } = useHandleParamUrl();
    const [selectedDebitServiceRows, setSelectedDebitServiceRows] = useState<any[]>([]);
    const [displayDebitServiceData, setDisplayDebitServiceData] = useState<any[]>([]);
    const [selectedDetail, setSelectedDetail] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<any>();
    const [price, setPrice] = useState(0);
    const [visible, setVisible] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [paramsPaginator, setParamsPaginator] = useState({
      pageNum: 1,
      pageSize: 20,
      first: 0,
      render: false,
      keyword: "",
      EmployeeId:employeeInfo?.id
    });
    const { data, loading, error, refresh } = useListContractFileNotDebitNangHa({ params: paramsPaginator, debounce: 500,});
    const { data: debitService, refresh:refreshHasDebitDispatch } = useListContractFileHasDebitNangHa({ params: {...paramsPaginator,},debounce: 500,});
    const { data: listCustomer } = useListPartnerDetailWithState({});
    const { data: listUser } = useListUserWithState({});
    const { data: listEmployee } = useListEmployeeWithState({});
    const openDialogAdd = (id:number,price:number) => {
        setSelectedId(id);
        setPrice(price);
        setVisible(true);
    };
    const handleModalClose = () => {
      setVisible(false);
      refresh?.(); 
      refreshHasDebitDispatch?.(); // reload debitDispatch
    };
    // ✅ Client-side pagination
    useEffect(() => {
        if (!data) return;
        handleParamUrl(paramsPaginator);
        const mapped = (data?.data || []).map((row: any) => {
            const cus = listCustomer.find((x: any) => x.id === row.customer_detail_id);
            const _user = listUser.find((x: any) => x.id === row.updated_by);
            const _employee = listEmployee.find((x: any) => x.id === row.employee_id);
            return {
                ...row,
                customerName: cus?.partners?.name || "",
                customerAbb: cus?.partners?.abbreviation || "",
                userName: `${_user?.last_name ?? ""} ${_user?.first_name ?? ""}`.trim(),
                employee: `${_employee?.last_name ?? ""} ${_employee?.first_name ?? ""}`.trim(),
            };
        });
         // gom debits
         const dataArray = Array.isArray(debitService?.data) ? debitService.data : [];
         const groupedHasDebitService = Object.values(
            dataArray.reduce((acc:any, cur:any) => {
              const { supplier_detail_id,debit_data,debit_bill,debit_employee_staff_id,debit_service_id,debit_type,debit_id,debit_name,debit_updated_at,debit_updated_by,debit_status,debit_accounting_date,debit_purchase_price,debit_purchase_vat,debit_total_purchase_price,debit_price,debit_vat,debit_total_price,cf_note,cf_status,cf_status_confirm,cf_updated_at,cf_updated_by, ...rest } = cur;
              if (!acc[cur.id]) {
                acc[cur.id] = { ...rest, debits: [] ,debit_ids: [] };
              }
              // chỉ gom debit nếu debitService có dữ liệu
              if (debitService?.data) {
                acc[cur.id].debits.push({ supplier_detail_id,debit_data,debit_bill,debit_employee_staff_id,debit_service_id,debit_type,debit_id,debit_name,debit_updated_at,debit_updated_by,debit_status,debit_accounting_date,debit_purchase_price,debit_purchase_vat,debit_total_purchase_price,debit_price,debit_vat,debit_total_price,cf_note,cf_status,cf_status_confirm,cf_updated_at,cf_updated_by});
                acc[cur.id].debit_ids.push(debit_id);
              }
              return acc;
            }, {} as Record<number, any>)
          );
          const mappedDebitService = groupedHasDebitService.map((row: any) => {
            const _customer = listCustomer?.find((x: any) => x.id === row.customer_detail_id);
            const _employee = listEmployee.find((x: any) => x.id === row.employee_id);
            const _sumNH = row.debits
              .filter((x: any) => x.debit_type === 3)
              .reduce((sum: number, x: any) => sum + (x.debit_purchase_price || 0), 0);
            const _sumCuoc = row.debits
              .filter((x: any) => x.service_id === 19)
              .reduce((sum: number, x: any) => sum + (x.debit_purchase_price || 0), 0);
              const cf_status_confirm = row.debits.find((x: any) => x.cf_status_confirm === 0);
            return {
              ...row,
              customerName: _customer?.partners?.name || "",
              customerAbb: _customer?.partners?.abbreviation || "",
              employee: `${_employee?.last_name ?? ""} ${_employee?.first_name ?? ""}`.trim(),
              sumCuoc:_sumCuoc,
              sumNH:_sumNH,
              cf_status_confirm:cf_status_confirm ? 0 : 1
            };
          });
         console.log(mappedDebitService);
                 
        setDisplayData(mapped);
        setDisplayDebitServiceData(mappedDebitService);
    }, [first, rows, data,debitService, paramsPaginator,listCustomer]);
 
    return (
      <>
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
              <div style={{ height: 'calc(100vh - 8rem)' }}>
                      <Splitter style={{ height: '100%', width: '100%' }}>
                        {/* Panel 1 */}
                        <SplitterPanel
                          size={35}
                          minSize={10}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                          }}
                        >
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <b>File chưa tạo bảng kê nâng hạ</b>
                          </div>
                        </SplitterPanel>
            
                        {/* Panel 2 */}
                        <SplitterPanel
                          size={65}
                          minSize={20}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                          }}
                        >
                          <Splitter layout="vertical" style={{ height: '100%' }}>
                            {/* Panel 2.1 */}
                            <SplitterPanel
                              size={75}
                              minSize={10}
                              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                            >
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                 <b>Bảng kê nâng hạ đã tạo</b>
                          
                              </div>
                            </SplitterPanel>
            
                            {/* Panel 2.2 */}
                            <SplitterPanel
                              size={25}
                              minSize={10}
                              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                            >
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <b>Chi tiết bảng kê nâng hạ</b>
                             
                              </div>
                            </SplitterPanel>
                          </Splitter>
                        </SplitterPanel>
                      </Splitter>
                    </div>
        </div>
         <Dialog
            position="top"
            dismissableMask
            header="Tạo bảng kê nâng hạ"
            visible={visible}
            onHide={() => setVisible(false)}
            style={{ width: "78vw" }}
          >
            <p className="m-0">
              {selectedId && <UpdateDebitNangHa id={selectedId} price={price} onClose={handleModalClose} ></UpdateDebitNangHa>}
            </p>
          </Dialog>
      </>
    );
}
