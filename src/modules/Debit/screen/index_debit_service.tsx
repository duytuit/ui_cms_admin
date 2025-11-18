import { useEffect, useMemo, useRef, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, Column, TimeBody, DataTableClient, DateBody, ActionBodyWithIds } from "components/common/DataTable";
import { Calendar, CalendarY, Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useDispatch, useSelector } from "react-redux";
import { loaiHang, loaiToKhai, nghiepVu, phatSinh, tinhChat, typeDebit, typeService } from "utils";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { useListUserWithState } from "modules/user/service";
import { Button, Checkbox, DataTable, Dialog } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useListContractFile, useListContractFileHasDebitService, useListContractFileNotService, useListContractFileWithState } from "modules/ContractFile/service";
import { deleteContractFile } from "modules/ContractFile/api";
import UpdateDebitChiPhi from "./update_service";
import { deleteDebit, deleteMultiDebit } from "../api";
import UpdateHoanUngGiaoNhan from "modules/receipt/screen/update_hoanung_giao_nhan";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator, selected }: any) => {
    const [visible, setVisible] = useState(false);
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
    const openDialogAdd = (e:any) => {
       setVisible(true)
    };
    const handleModalClose = () => {
       setVisible(false);
    };
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
      <>
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
      </>
       
    );
};

export default function ListContractFileBangKe() {
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
    const { data, loading, error, refresh } = useListContractFileNotService({ params: paramsPaginator, debounce: 500,});
    const { data: debitService, refresh:refreshHasDebitDispatch } = useListContractFileHasDebitService({ params: {...paramsPaginator,},debounce: 500,});
    const { data: contractFile } = useListContractFileWithState({});
    const { data: listCustomer } = useListCustomerDetailWithState({status: 1});
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
              const {debit_data,debit_bill,debit_employee_staff_id,debit_service_id,debit_type,debit_id,debit_name,debit_updated_at,debit_updated_by,debit_status,debit_accounting_date,debit_purchase_price,debit_purchase_vat,debit_total_purchase_price,debit_price,debit_vat,debit_total_price,cf_note,cf_status,cf_status_confirm,cf_updated_at,cf_updated_by, ...rest } = cur;
              if (!acc[cur.id]) {
                acc[cur.id] = { ...rest, debits: [] ,debit_ids: [] };
              }
              // chỉ gom debit nếu debitService có dữ liệu
              if (debitService?.data) {
                acc[cur.id].debits.push({ debit_data,debit_bill,debit_employee_staff_id,debit_service_id,debit_type,debit_id,debit_name,debit_updated_at,debit_updated_by,debit_status,debit_accounting_date,debit_purchase_price,debit_purchase_vat,debit_total_purchase_price,debit_price,debit_vat,debit_total_price,cf_note,cf_status,cf_status_confirm,cf_updated_at,cf_updated_by});
                acc[cur.id].debit_ids.push(debit_id);
              }
              return acc;
            }, {} as Record<number, any>)
          );
          const mappedDebitService = groupedHasDebitService.map((row: any) => {
            const _customer = listCustomer?.find((x: any) => x.id === row.customer_detail_id);
            const _employee = listEmployee.find((x: any) => x.id === row.employee_id);
            const _sumHQ = row.debits
              .filter((x: any) => x.debit_type === 0)
              .reduce((sum: number, x: any) => sum + (x.debit_purchase_price || 0), 0);

            const _sumCH = row.debits
              .filter((x: any) => x.debit_type === 2)
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
              sumCH:_sumCH,
              sumHQ: _sumHQ,
              phaiTra:row.receipt_total-(_sumCH+_sumHQ),
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
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} selected={selectedDebitServiceRows} />
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
                            <b>File chưa tạo bảng kê</b>
                                <DataTableClient
                                rowHover
                                value={displayData}
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
                                scrollHeight="flex"
                                style={{ flex: 1 }}
                                tableStyle={{ minWidth: "1600px" }}// ép bảng rộng hơn để có scroll ngang
                                >
                                {/* Custom checkbox column */}
                                <Column
                                    header={
                                    <Checkbox
                                        checked={selectedRows.length === displayData.length && displayData.length > 0}
                                        onChange={(e:any) => {
                                            if (e.checked) setSelectedRows(displayData.map(d => d.id));
                                            else setSelectedRows([]);
                                        }}
                                    />
                                    }
                                    body={(rowData:any) => (
                                    <Checkbox
                                        className="p-checkbox-sm"
                                        checked={selectedRows.includes(rowData.id)}
                                        onChange={(e:any) => {
                                            if (e.checked) setSelectedRows(prev => [...prev, rowData.id]);
                                            else setSelectedRows(prev => prev.filter(id => id !== rowData.id));
                                        }}
                                        onClick={(e:any) => e.stopPropagation()} // ⚡ chặn row click
                                    />
                                    )}
                                    style={{ width: "3em" }}
                                />
                               <Column
                                  header="Thao tác"
                                  body={(e: any) =>
                                    ActionBody(e, null, null, null, null, () =>
                                      openDialogAdd(e.id,e.total)
                                    )
                                  }
                                  style={{ width: "6em" }}
                                />
                                <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="employee" header="Giao nhận" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="total" body={(row: any) => row.total ? Helper.formatCurrency(row.total.toString()) :"" } header="Duyệt ứng" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="declaration" header="Số bill" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="quantity" header="Số lượng" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="userName" header="Người cập nhật" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                            </DataTableClient>
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
                                 <b>Bảng kê chi phí đã tạo</b>
                                    <DataTableClient
                                        rowHover
                                        value={displayDebitServiceData}
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
                                        scrollHeight="flex"
                                        style={{ flex: 1 }}
                                        tableStyle={{ minWidth: "2000px" }}
                                        onRowClick={(e: any) => {
                                          setSelectedDetail(e.data.debits)
                                          console.log(e.data.debits);
                                          
                                        }}
                                      >
                                        {/* Custom checkbox column */}
                                        <Column
                                            header={
                                                <Checkbox
                                                    checked={
                                                        selectedDebitServiceRows.length > 0 &&
                                                        selectedDebitServiceRows.length === displayDebitServiceData.length
                                                    }
                                                    onChange={(e:any) => {
                                                        if (e.checked) {
                                                            // Lưu nguyên rowData
                                                            setSelectedDebitServiceRows([...displayDebitServiceData]);
                                                        } else {
                                                            setSelectedDebitServiceRows([]);
                                                        }
                                                    }}
                                                />
                                            }
                                            body={(rowData: any) => {
                                                const isChecked =
                                                    selectedDebitServiceRows.findIndex(x => x.id === rowData.id) !== -1;
                                                return (
                                                    <Checkbox
                                                        className="p-checkbox-sm"
                                                        checked={isChecked}
                                                        onChange={(e:any) => {
                                                            if (e.checked) {
                                                                // thêm cả object
                                                                setSelectedDebitServiceRows(prev => [...prev, rowData]);
                                                            } else {
                                                                // xoá theo id
                                                                setSelectedDebitServiceRows(prev =>
                                                                    prev.filter(x => x.id !== rowData.id)
                                                                );
                                                            }
                                                        }}
                                                        onClick={(e:any) => e.stopPropagation()}
                                                    />
                                                );
                                            }}
                                            style={{ width: "3em" }}
                                        />
                                        <Column
                                            header="Thao tác"
                                            body={(row: any) => {
                                              if(row.cf_status_confirm == 1){
                                                
                                              }else{
                                                return ActionBodyWithIds(
                                                    row.debit_ids,
                                                    null,
                                                    { route: "Debit/delete/multi", action: deleteMultiDebit },
                                                    paramsPaginator,
                                                    setParamsPaginator
                                                );
                                              }
                                            }}
                                        />
                                        <Column header="Trạng thái" body={(row: any) => {
                                          if(row.cf_status_confirm == 1){
                                            return <Button label="đã duyệt" rounded severity="success" size="small" text  />
                                          }else{
                                            return <Button label="chưa duyệt" rounded severity="warning" size="small" text  />
                                          }
                                        }} filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="file_number" header="Số chứng từ" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="receipt_total" body={(row: any) => Helper.formatCurrency(row.receipt_total.toString())} header="Duyệt ứng" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="sumHQ" body={(row: any) => Helper.formatCurrency(row.sumHQ.toString())} header="Tổng phí HQ" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="sumCH" body={(row: any) => Helper.formatCurrency(row.sumCH.toString())} header="Tổng phí CH" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="sumCuoc" body={(row: any) => Helper.formatCurrency(row.sumCuoc.toString())} header="Tiền cược" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="phaiTra" body={(row: any) => Helper.formatCurrency(row.phaiTra.toString())} header="Phải thanh toán" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="employee" header="Tên giao nhận" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column header="Người cập nhật" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                                  </DataTableClient>
                              </div>
                            </SplitterPanel>
            
                            {/* Panel 2.2 */}
                            <SplitterPanel
                              size={25}
                              minSize={10}
                              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                            >
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <b>Chi tiết bảng kê chi phí</b>
                                  <DataTable rowHover value={selectedDetail}>
                                      <Column field="debit_name" header="Chi phí" />
                                      <Column field="debit_type"  body={(row: any) => typeDebit.find((x:any) => x.type === row.debit_type)?.name || ""} header="Loại chi phí" />
                                      <Column field="debit_purchase_price" body={(row: any) => Helper.formatCurrency(row.debit_purchase_price.toString())} header="Số tiền" />
                                  </DataTable>
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
            header="Tạo bảng kê chi phí"
            visible={visible}
            onHide={() => setVisible(false)}
            style={{ width: "78vw" }}
          >
            <p className="m-0">
              {selectedId && <UpdateDebitChiPhi id={selectedId} price={price} onClose={handleModalClose} ></UpdateDebitChiPhi>}
            </p>
          </Dialog>
      </>
    );
}
