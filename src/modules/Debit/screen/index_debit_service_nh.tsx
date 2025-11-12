import { useEffect, useMemo, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient, DateBody, ActionBodyWithIds } from "components/common/DataTable";
import { Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { typeDebit } from "utils";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { useListUserWithState } from "modules/user/service";
import { Checkbox, DataTable, Dialog } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useListContractFileHasDebitNangHa, useListContractFileHasDebitService, useListContractFileNotDebitNangHa, useListContractFileNotService, useListContractFileWithState } from "modules/ContractFile/service";
import {  deleteMultiDebit } from "../api";
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
              const { service_id, debit_price,debit_purchase_price, debit_total, debit_type, debit_vat,debit_id,debit_name,debit_updated_at,debit_updated_by, ...rest } = cur;
              if (!acc[cur.id]) {
                acc[cur.id] = { ...rest, debits: [] ,debit_ids: [] };
              }
              // chỉ gom debit nếu debitService có dữ liệu
              if (debitService?.data) {
                acc[cur.id].debits.push({ service_id, debit_price,debit_purchase_price, debit_vat, debit_total, debit_type,debit_id,debit_name ,debit_updated_at,debit_updated_by});
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
            return {
              ...row,
              customerName: _customer?.partners?.name || "",
              customerAbb: _customer?.partners?.abbreviation || "",
              employee: `${_employee?.last_name ?? ""} ${_employee?.first_name ?? ""}`.trim(),
              sumCuoc:_sumCuoc,
              sumNH:_sumNH,
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
                                <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="employee" header="Giao nhận" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="container_code" header="Số cont" filter showFilterMenu={false} filterMatchMode="contains" />
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
                                 <b>Bảng kê nâng hạ đã tạo</b>
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
                                      tableStyle={{ minWidth: "2900px" }}
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
                                              selectedDebitServiceRows.length === displayDebitServiceData.length &&
                                              displayDebitServiceData.length > 0
                                            }
                                            onChange={(e: any) => {
                                              if (e.checked)
                                                setSelectedDebitServiceRows(displayDebitServiceData.map((d) => d.id));
                                              else setSelectedDebitServiceRows([]);
                                            }}
                                          />
                                        }
                                        body={(rowData: any) => (
                                          <Checkbox
                                            className="p-checkbox-sm"
                                            checked={selectedDebitServiceRows.includes(rowData.id)}
                                            onChange={(e: any) => {
                                              if (e.checked)
                                                setSelectedDebitServiceRows((prev) => [...prev, rowData.id]);
                                              else
                                                setSelectedDebitServiceRows((prev) =>
                                                  prev.filter((id) => id !== rowData.id)
                                                );
                                            }}
                                            onClick={(e: any) => e.stopPropagation()} // ⚡ chặn row click
                                          />
                                        )}
                                        style={{ width: "3em" }}
                                      />
                                        <Column
                                            header="Thao tác"
                                            body={(row: any) => {
                                                return ActionBodyWithIds(
                                                    row.debit_ids,
                                                    null,
                                                    { route: "Debit/delete/multi", action: deleteMultiDebit },
                                                    paramsPaginator,
                                                    setParamsPaginator
                                                );
                                            }}
                                        />
                                        <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="container_code" header="Số cont" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="sumCuoc" body={(row: any) => Helper.formatCurrency(row.sumCuoc.toString())} header="Tiền cược" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="sumNH" body={(row: any) => Helper.formatCurrency(row.sumNH.toString())} header="Tổng phí nâng hạ" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="employee" header="Tên giao nhận" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column header="Xác nhận" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column header="Thời gian xác nhận" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column header="Đã duyệt" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column header="Thời gian duyệt" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column header="Lý do duyệt" filter showFilterMenu={false} filterMatchMode="contains" />
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
                                <b>Chi tiết bảng kê nâng hạ</b>
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
