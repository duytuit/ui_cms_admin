import { useEffect, useMemo, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient, DateBody, ActionBodyWithIds } from "components/common/DataTable";
import { Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { typeDebit } from "utils";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { useListUserWithState } from "modules/user/service";
import { Button, Checkbox, DataTable, Dialog, Tag } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useListContractFileHasDebitNangHa, useListContractFileHasDebitService, useListContractFileHasFileGia, useListContractFileNotDebitNangHa, useListContractFileNotFileGia, useListContractFileNotService, useListContractFileWithState } from "modules/ContractFile/service";
import {  deleteMultiDebit } from "../api";
import UpdateDebitNangHa from "./update_service_nh";
import UpdateFileGia from "./update_debit_file_gia";
import { Link } from "react-router-dom";
import UpdateVATFileGia from "./update_vat_file_gia";
import UpdateXuatHoaDon from "./update_xuat_hoadon";
import { FilterMatchMode } from "primereact/api";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator ,selected ,refreshHasFileGia,_setSelectedRows}: any) => {
    const [filter, setFilter] = useState({ name: "", customerDetailId: "" ,fromDate:Helper.lastWeekString(),toDate:Helper.toDayString()});
    const { data: customerDetails } = useListCustomerDetailWithState({status:1});
    const [visible, setVisible] = useState(false);
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
    const openDialogAdd = () => {
      console.log(selected);
      setVisible(true);
    };
    const handleModalClose = () => {
        setVisible(false);
        _setSelectedRows([])
        refreshHasFileGia?.(); 
    };
    return (
      <>
       <GridForm
            paramsPaginator={_paramsPaginator}
            setParamsPaginator={_setParamsPaginator}
            filter={filter}
            setFilter={setFilter}
            className="lg:col-9"
            openDialogAdd={()=>openDialogAdd()}
            openDialogAddName="Xuất hóa đơn"
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
         <Dialog
                position="top"
                dismissableMask
                visible={visible}
                onHide={() => setVisible(false)}
                style={{ width: "30vw", top:"30px" }}
            >
              <p className="m-0">
                {selected && <UpdateXuatHoaDon ids={selected} onClose={handleModalClose} ></UpdateXuatHoaDon>}
              </p>
          </Dialog>
      </>
       
    );
};

export default function ListFileGia() {
    const employeeInfo = localStorage.getItem('employeeInfo') ? JSON.parse(localStorage.getItem('employeeInfo') || '{}') : null;
    const { handleParamUrl } = useHandleParamUrl();
    const [selectedFileGiaRows, setSelectedFileGiaRows] = useState<any[]>([]);
    const [displayFileGia, setDisplayFileGia] = useState<any[]>([]);
    const [selectedDetail, setSelectedDetail] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<any>();
    const [selectedIdEdit, setSelectedIdEdit] = useState<any>();
    const [visible, setVisible] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
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
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        file_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
        customerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        customerAbb: { value: null, matchMode: FilterMatchMode.CONTAINS },
        sales: { value: null, matchMode: FilterMatchMode.CONTAINS },
        container_code: { value: null, matchMode: FilterMatchMode.CONTAINS },
        declaration: { value: null, matchMode: FilterMatchMode.CONTAINS },
        bill: { value: null, matchMode: FilterMatchMode.CONTAINS },
        debit_cus_bill: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cf_status_confirm: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const { data, loading, error, refresh } = useListContractFileNotFileGia({ params: paramsPaginator, debounce: 500,});
    const { data: listFileGia, refresh:refreshHasFileGia } = useListContractFileHasFileGia({ params: {...paramsPaginator,},debounce: 500,});
    const { data: listCustomer } = useListCustomerDetailWithState({status: 1});
    const { data: listUser } = useListUserWithState({});
    const { data: listEmployee } = useListEmployeeWithState({});
    const openDialogAdd = (id:number,price:number) => {
        setSelectedId(id);
        setVisible(true);
    };
    const openDialogEdit = (id:number) => {
        setSelectedIdEdit(id);
        setVisibleEdit(true);
    };
    const handleModalEditClose = () => {
      setVisibleEdit(false);
      refresh?.(); 
      refreshHasFileGia?.(); // reload debitDispatch
    };
    const handleModalClose = () => {
      setVisible(false);
      refresh?.(); 
      refreshHasFileGia?.(); // reload debitDispatch
    };
    // ✅ Client-side pagination
    useEffect(() => {
        if (!data) return;
        handleParamUrl(paramsPaginator);
        const mapped = (data?.data || []).map((row: any) => {
            const cus = listCustomer.find((x: any) => x.id === row.customer_detail_id);
            const _user = listUser.find((x: any) => x.id === row.updated_by);
            return {
                ...row,
                customerName: cus?.partners?.name || "",
                customerAbb: cus?.partners?.abbreviation || "",
                userName: `${_user?.last_name ?? ""} ${_user?.first_name ?? ""}`.trim(),
            };
        });
         
        // gom debits
         const dataArray = Array.isArray(listFileGia?.data) ? listFileGia.data : [];
         const groupedHasFileGia = Object.values(
            dataArray.reduce((acc:any, cur:any) => {
              const {debit_data,debit_bill,debit_employee_staff_id,debit_service_id,debit_type,debit_id,debit_name,debit_updated_at,debit_updated_by,debit_status,debit_accounting_date,debit_purchase_price,debit_purchase_vat,debit_total_purchase_price,debit_price,debit_vat,debit_total_price,cf_note,cf_status,cf_status_confirm,debit_cus_bill,debit_cus_bill_date,debit_sup_bill,debit_sup_bill_date,debit_vehicle_number,debit_total_vat, ...rest } = cur;
              if (!acc[cur.id]) {
                acc[cur.id] = { ...rest, debits: [] ,debit_ids: [] };
              }
              // chỉ gom debit nếu debitService có dữ liệu
              if (listFileGia?.data) {
                acc[cur.id].debits.push({debit_data,debit_bill,debit_employee_staff_id,debit_service_id,debit_type,debit_id,debit_name,debit_updated_at,debit_updated_by,debit_status,debit_accounting_date,debit_purchase_price,debit_purchase_vat,debit_total_purchase_price,debit_price,debit_vat,debit_total_price,cf_note,cf_status,cf_status_confirm,debit_cus_bill,debit_cus_bill_date,debit_sup_bill,debit_sup_bill_date,debit_vehicle_number,debit_total_vat});
                acc[cur.id].debit_ids.push(debit_id);
              }
              return acc;
            }, {} as Record<number, any>)
          );
          const mappedDebitFileGia = groupedHasFileGia.map((row: any) => {
            const _customer = listCustomer?.find((x: any) => x.id === row.customer_detail_id);
            const _employee = listEmployee.find((x: any) => x.id === row.employee_id);
            const _sumMua = row.debits.reduce((sum: number, x: any) => sum + (x.debit_purchase_price || 0), 0);
            const _sumBan = row.debits.reduce((sum: number, x: any) => sum + (x.debit_price || 0), 0);
            const _sumVat = row.debits.reduce((sum: number, x: any) => sum + (x.debit_total_vat || 0), 0);
            const cf_status_confirm = row.debits.find((x: any) => x.cf_status_confirm === 0);
            const _userUpdate = listEmployee.find((x: any) => x.user_id === row.cf_updated_by);
            return {
              ...row,
              customerName: _customer?.partners?.name || "",
              customerAbb: _customer?.partners?.abbreviation || "",
              employee: `${_employee?.last_name ?? ""} ${_employee?.first_name ?? ""}`.trim(),
              sumMua:_sumMua,
              sumBan:_sumBan,
              sumVat:_sumVat,
              loiNhuan:_sumBan-_sumMua,
              cf_status_confirm:cf_status_confirm ? 0 : 1,
              userUpdate: `${_userUpdate?.last_name ?? ""} ${_userUpdate?.first_name ?? ""}`.trim(),
              debit_cus_bill :  (row.debits && row.debits.length > 0) ?  row.debits[0]?.debit_cus_bill || "":""
            };
          });
         console.log(mappedDebitFileGia);
        setDisplayData(mapped);
        setDisplayFileGia(mappedDebitFileGia);
    }, [first, rows, data,listFileGia, paramsPaginator,listCustomer]);
    const getSumColumn = (field: string) => {
        const filtered = (displayFileGia??[]).filter((item: any) => {
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
    const statusOptions = [
      { label: 'Đã duyệt', value: 1 },
      { label: 'Chưa duyệt', value: 0 }
    ];
    return (
      <>
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} selected={selectedFileGiaRows} refreshHasFileGia={refreshHasFileGia}   _setSelectedRows={setSelectedFileGiaRows} />
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
                            <b>Bảng chưa tạo file giá</b>
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
                                <Column field="sales" header="Tên Sales" filter showFilterMenu={false} filterMatchMode="contains" />
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
                                 <b>Bảng theo dõi file giá</b>
                                  <DataTableClient
                                      rowHover
                                      value={displayFileGia}
                                      onPage={(e: any) => {
                                        setFirst(e.first);
                                        setRows(e.rows);
                                      }}
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
                                      tableStyle={{ minWidth: "2100px" }}
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
                                              selectedFileGiaRows.length === displayFileGia.length &&
                                              displayFileGia.length > 0
                                            }
                                            onChange={(e: any) => {
                                              if (e.checked)
                                                setSelectedFileGiaRows(displayFileGia.map((d) => d.id));
                                              else setSelectedFileGiaRows([]);
                                            }}
                                          />
                                        }
                                        body={(rowData: any) => (
                                          <Checkbox
                                            className="p-checkbox-sm"
                                            checked={selectedFileGiaRows.includes(rowData.id)}
                                            onChange={(e: any) => {
                                              if (e.checked)
                                                setSelectedFileGiaRows((prev) => [...prev, rowData.id]);
                                              else
                                                setSelectedFileGiaRows((prev) =>
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
                                               if(row.cf_status_confirm == 0){
                                                    return ActionBodyWithIds(
                                                        row.debit_ids,
                                                        null,
                                                        { route: "Debit/delete/multi", action: deleteMultiDebit },
                                                        paramsPaginator,
                                                        setParamsPaginator,
                                                        null,
                                                        () =>openDialogEdit(row.id)
                                                    );
                                                }else{
                                                     return ActionBodyWithIds(
                                                        row.debit_ids,
                                                        null,
                                                        null,
                                                        paramsPaginator,
                                                        setParamsPaginator,
                                                        null,
                                                        () =>openDialogEdit(row.id)
                                                    );
                                                }
                                            }}
                                            style={{ width: "5em" }}
                                        />
                                        <Column
                                          field="cf_status_confirm"
                                          header="Trạng thái"
                                          body={(row: any) => (
                                              row.cf_status_confirm === 1 ? (
                                                  <div className="flex justify-content-between align-items-center">
                                                      <Button label="Đã duyệt" rounded severity="success" size="small" text />
                                                      <a href={`/debit/print?id=${row.id}`} target="_blank" rel="noopener noreferrer">
                                                          <Button label="In" rounded icon="pi pi-print" severity="info" size="small" text />
                                                      </a>
                                                  </div>
                                              ) : (
                                                  <Button label="Chưa duyệt" rounded severity="warning" size="small" text />
                                              )
                                          )}
                                          filter
                                          filterElement={(options:any) => (
                                              <Dropdown
                                                  value={options.value}
                                                  options={statusOptions}
                                                  onChange={(e:any) => {
                                                    options.filterApplyCallback(e.value)
                                                  }}
                                                  placeholder="Chọn trạng thái"
                                                  className="p-column-filter"
                                                  showClear
                                              />
                                          )}
                                          showFilterMenu={false}  style={{ width:"180px" }}/>
                                        <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="container_code" header="Số cont" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="bill" header="Số bill" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="declaration" header="Số tờ khai" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="debit_cus_bill" header="Số hóa đơn" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column header="Ngày hóa đơn"
                                          body={(e: any) =>
                                            {
                                              if(e.debits && e.debits.length > 0){
                                                return DateBody(e.debits[0]?.debit_cus_bill_date)
                                              }
                                            }
                                          } filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="sales" header="Tên Sales" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="sumMua" body={(row: any) => Helper.formatCurrency(row.sumMua.toString())} 
                                          footer={getSumColumn("sumMua")}
                                          footerStyle={{ fontWeight: "bold" }}
                                          header="Tổng mua" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="sumBan" body={(row: any) => Helper.formatCurrency(row.sumBan.toString())}
                                            footer={getSumColumn("sumBan")}
                                            footerStyle={{ fontWeight: "bold" }}
                                            header="Tổng bán" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="sumVat" body={(row: any) => Helper.formatCurrency(row.sumVat.toString())}
                                            footer={getSumColumn("sumVat")}
                                            footerStyle={{ fontWeight: "bold" }}
                                            header="Tổng VAT" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column field="loiNhuan" body={(row: any) => Helper.formatCurrency(row.loiNhuan.toString())} 
                                            footer={getSumColumn("loiNhuan")}
                                            footerStyle={{ fontWeight: "bold" }}
                                            header="Lợi nhuận" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column header="Người duyệt" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column header="Thời gian duyệt" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column header="Lý do duyệt" filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column header="Người cập nhật" body={(row: any) => row.userUpdate} filter showFilterMenu={false} filterMatchMode="contains" />
                                        <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.cf_updated_at)} />
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
                                <b>Chi tiết file giá</b>
                                  <DataTable 
                                    rowHover
                                    scrollable
                                    scrollHeight="flex"
                                    style={{ flex: 1 }}
                                    value={selectedDetail}
                                   >
                                      <Column body={(row: any) =>{
                                          let data = JSON.parse(row.debit_data);
                                          return data?.fileNumber
                                      }} header="Số file" />
                                      <Column field="debit_name" header="Chi phí" />
                                      <Column field="debit_type"  body={(row: any) => typeDebit.find((x:any) => x.type === row.debit_type)?.name || ""} header="Loại chi phí" />
                                      <Column body={(row: any) =>{
                                          let data = JSON.parse(row.debit_data);
                                          return data?.partner_info?.partnerLabel
                                      }} header="Nhà cung cấp" />
                                      <Column field="debit_vehicle_number" header="Biển số" />
                                      <Column field="debit_purchase_price" body={(row: any) => Helper.formatCurrency(row.debit_purchase_price.toString())} header="Giá mua" />
                                      <Column field="debit_price" body={(row: any) => Helper.formatCurrency(row.debit_price.toString())} header="Giá bán" />
                                      <Column field="debit_vat" header="VAT" />
                                      <Column field="debit_total_price" body={(row: any) => Helper.formatCurrency(row.debit_total_price.toString())} header="Thành tiền" />
                                      <Column field="debit_cus_bill" header="Hóa đơn" />
                                      <Column field="debit_cus_bill_date" body={(e: any) => DateBody(e.debit_cus_bill_date)} header="Ngày xuất hóa đơn" />
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
            header="Tạo file giá"
            visible={visible}
            onHide={() => setVisible(false)}
            style={{ width: "78vw" }}
          >
            <p className="m-0">
              {selectedId && <UpdateFileGia id={selectedId} onClose={handleModalClose} ></UpdateFileGia>}
            </p>
          </Dialog>
           <Dialog
            position="top"
            dismissableMask
            header="Sửa VAT file giá"
            visible={visibleEdit}
            onHide={() => setVisibleEdit(false)}
            style={{ width: "78vw" }}
          >
            <p className="m-0">
              {selectedIdEdit && <UpdateVATFileGia id={selectedIdEdit} onClose={handleModalEditClose} ></UpdateVATFileGia>}
            </p>
          </Dialog>
      </>
    );
}
